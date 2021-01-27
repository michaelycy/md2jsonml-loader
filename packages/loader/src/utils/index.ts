import fs from 'fs';
import R from 'ramda';
import path from 'path';
import jsonMLUtils from 'jsonml.js/lib/utils';
import { transform } from 'md2jsonml-core';
import { highlight } from './highlight';
import { parse } from '@babel/core';
import { File } from '@babel/types';
import { resolveExtensions } from '../constant/resolve-demo';
import { IBabelConfig, IDependencyFile, IDependencyLocal, IToc } from './types';

const { getTagName, getChildren, isElement } = jsonMLUtils;

/**
 * 标签是否为 heading
 * @param tagname tag
 */
export const isHeading = (tagname: string) => /^h[1-6]$/i.test(tagname);

/**
 * 获取 demo 索引范围数组
 * @param param0 md 数据
 */
export const getDemoRanges = (content: any[] = []) => {
  const contentLength = content.length;
  const demoRanges: { start: number; end: number }[] = [];

  content.forEach((node, i) => {
    if (getTagName(node) === 'hr' && getTagName(content[i - 1]) === 'h4') {
      const start = i - 1;
      let end = 0;
      let endMark = false;
      let nextIndex = i + 1;

      /**
       * demo 标签的范围是
       * 起始：  ['h4','标题']
       *        ['hr']
       *
       * 结束： ['p',['demo',{src:'*'}]]
       */
      while (endMark === false) {
        const nextNode = content[nextIndex];
        const nextNodeTagName = getTagName(nextNode);

        // 若第一个 tag 不为 p 标签 则结束本次循环
        if (nextNodeTagName !== 'p') {
          nextIndex = nextIndex + 1;
          continue;
        }

        const children = getChildren(nextNode);

        if (children.length <= 0) {
          nextIndex = nextIndex + 1;
          continue;
        }

        const isElem = isElement(children[0]);

        if (!isElem) {
          nextIndex = nextIndex + 1;
          continue;
        }

        if (getTagName(children[0]) === 'demo') {
          endMark = true;
          end = nextIndex;
        }

        // 若超出长度则标记完成
        if (contentLength - 1 >= nextIndex) {
          endMark = true;
        }
      }

      if (end > 0) {
        demoRanges.push({ start, end });
      }
    }
  });

  return demoRanges;
};

/**
 * 获取 demo 代码以及追加高亮
 * @param filepath demo 代码地址
 */
export const getDemoCodeAndHighlight = (filepath: string) => {
  const codeText = fs.readFileSync(filepath, 'utf-8');
  const lang = path.extname(filepath).replace('.', '');

  const mdJsonml = transform(`\`\`\`${lang.toLowerCase().trim()}
${codeText}
\`\`\``);
  highlight(mdJsonml.content);

  return { code: codeText, highlight: mdJsonml.content };
};

/**
 * 解析代码 code, 获取依赖列表
 * @param code {string} code
 */
export const getDemoCodeDependencies = (code: string, babelConfig: IBabelConfig = {}) => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  const { presets, plugins, filename } = babelConfig;
  let dependencies: string[] = [];

  // 关于 filename 需要优化  比如确定 ts 或者 tsx
  const codeAst = parse(code, {
    filename,
    babelrc: false,
    configFile: false,
    presets: presets || [['react-app', { flow: false, typescript: true }]],
    plugins,
  });

  if (codeAst) {
    const { program } = codeAst as File;

    dependencies = Array.from(
      new Set(
        program.body
          .filter(({ type }) => type === 'ImportDeclaration')
          .map((item: any) => item.source.value)
      )
    );
  }

  return dependencies;
};

/** 文件是否存在 */
const isExist = (filepath: string) => fs.existsSync(filepath);

/** 是否为文件夹 */
const isDirectory = (filepath: string) => {
  const stat = fs.statSync(filepath);

  return stat.isDirectory();
};

/**
 * 获取 ../ .. ./ . 的文件路径
 */
const getRealIndexFilepath = (
  filepath: string,
  absFilepath: string,
  extensions: string[] = resolveExtensions
) => {
  const files = fs.readdirSync(absFilepath);
  // 获取index.xx.xx.xx 的文件
  const indexFiles = R.filter<string>(p => {
    const abs = path.join(absFilepath, p);
    return /index\.[a-z]+$/.test(p) && isExist(abs) && isDirectory(abs) === false;
  })(files);

  for (const ext of extensions) {
    const current = `index${ext}`;

    if (indexFiles.includes(current)) {
      return {
        import: filepath,
        path: path.join(filepath, current),
        absolutePath: path.join(absFilepath, current),
      };
    }
  }

  return undefined;
};

/**
 * 获取 ../xx ./xx 的文件路径
 */
const getRealFilepath = (
  filepath: string,
  absFilepath: string,
  extensions: string[] = resolveExtensions
) => {
  if (isDirectory(absFilepath)) {
    return getRealIndexFilepath(filepath, absFilepath, extensions);
  }

  for (const ext of extensions) {
    const current = `${absFilepath}${ext}`;

    if (isExist(current) && isDirectory(current) === false) {
      return {
        import: filepath,
        path: filepath + ext,
        absolutePath: current,
      };
    }
  }

  return undefined;
};

const getVMPath = (filepath: string, vm = '_temp') =>
  filepath.replace(/\.\./g, vm).replace(/\.\//, '');

/** 获取 demo 中本地文件依赖 */
export const getDemoCodeLocal = (
  depPath: string,
  context: string,
  tmp?: string,
  extensions?: string[]
) => {
  const absolutePath = path.join(context, depPath);

  // 对 ..、../、.、./ 类型导入做处理
  if (['../', '..', '.', './'].includes(depPath)) {
    const indexFilename = getRealIndexFilepath(depPath, absolutePath, extensions);

    if (indexFilename) {
      return {
        path: indexFilename.path,
        import: indexFilename.import,
        vmPath: getVMPath(indexFilename.path, tmp),
        source: fs.readFileSync(indexFilename.absolutePath, 'utf-8'),
      };
    }

    throw new Error(`${absolutePath} file not found`);
  }

  // 对 ../XX ./XX 类型文件做处理
  const [lastName] = depPath.split(path.sep).slice(-1);
  if (lastName === 'index') {
    const indexFilename = getRealIndexFilepath(depPath, path.dirname(absolutePath), extensions);

    if (indexFilename) {
      return {
        import: indexFilename.import,
        path: indexFilename.path,
        vmPath: getVMPath(indexFilename.path, tmp),
        source: fs.readFileSync(indexFilename.absolutePath, 'utf-8'),
      };
    }

    throw new Error(`${absolutePath} file not found`);
  }

  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
    return {
      import: depPath,
      path: depPath,
      vmPath: getVMPath(depPath, tmp),
      source: fs.readFileSync(absolutePath, 'utf-8'),
    };
  }

  const filepath = getRealFilepath(depPath, absolutePath, extensions);

  if (filepath) {
    return {
      import: filepath.import,
      path: filepath.path,
      vmPath: getVMPath(filepath.path, tmp),
      source: fs.readFileSync(filepath.absolutePath, 'utf-8'),
    };
  }

  throw new Error(`${absolutePath} file not found`);
};

/**
 * 生成沙箱 code
 * @param code code
 * @param dependencies 依赖
 */
export const genSandboxCode = (code: string, dependencies: IDependencyFile[] = []) => {
  if (dependencies.length === 0) {
    return code;
  }
  // 获取父类文件
  const parentPathReg = /^(\.{2}\/)|(^\.{2}$)/;
  const tmpFiles = R.filter<IDependencyFile>(
    item => item.type === 'local' && parentPathReg.test(item.import)
  )(dependencies) as IDependencyLocal[];

  let sandboxCode = code;

  // 变量替换包含父类目录的导入，将其转换为临时目录
  for (const item of tmpFiles) {
    sandboxCode = R.replace(item.import, `./${item.vmPath}`, sandboxCode);
  }

  return sandboxCode;
};

const packageVersionsCache = new Map<string, { name: string; version: string }>();

/**
 * 获取本地安装的版本信息
 * @param pkgName package 名称
 */
export const getDependenciesVersion = (pkgName: string) => {
  const hasCache = packageVersionsCache.has(pkgName);

  if (hasCache) {
    return packageVersionsCache.get(pkgName) as { name: string; version: string };
  }

  try {
    const resolvePath = require.resolve(pkgName);
    const paths = R.split(resolvePath, path.sep);
    const nmIndex = R.findLastIndex(name => 'node_modules' === name, paths);
    const nmPath = R.pipe(R.slice(0, nmIndex + 1), R.join(path.sep))(paths);
    const currentPath = path.join(nmPath, pkgName, 'package.json');
    const { name, version } = require(currentPath);
    const dep = { name, version } as { name: string; version: string };

    packageVersionsCache.set(pkgName, dep);

    return dep;
  } catch (err) {
    throw new Error(err);
  }
};

export const genTocJsonML = (clsPrefix?: string, list: IToc[] = [], keepElem = false) => {
  const itemList = list.map(({ text, id, tag, node }) => [
    'li',
    { className: `${clsPrefix}-toc-li toc-li` },
    ['a', { className: `${clsPrefix}-toc-${tag}`, href: `#${id}`, title: text }].concat(
      keepElem ? node : [text]
    ),
  ]);

  return ['ul', { className: `${clsPrefix}-toc-ul toc-ul` }, ...itemList];
};
