import path from 'path';
import R from 'ramda';
import jsonMLUtils from 'jsonml.js/lib/utils';
import {
  getDemoRanges,
  genSandboxCode,
  getDemoCodeLocal,
  getDependenciesVersion,
  getDemoCodeAndHighlight,
  getDemoCodeDependencies,
  genTocJsonML,
} from '.';
import { IMarkdownData } from '../types';
import {
  IDataAppendOptions,
  IAppendsDemo,
  IDependencyFile,
  IMarkdownDataAppendDemo,
  IDependencyPackage,
} from '../utils/types';

const {
  getAttributes,
  setAttribute,
  getTagName,
  getChildren,
  isElement,
  hasAttributes,
} = jsonMLUtils;

function transform(markdownData: IMarkdownData, options: IDataAppendOptions = {}) {
  const { fileAbsolutePath, content = [] } = markdownData;
  const {
    clsPrefix = 'md',
    babelConfig,
    resolveExtensions,
    ignoreDependencies = [],
    presetDependencies = {},
  } = options;

  // 预设依赖
  const presetDependencyNameRules = Object.keys(presetDependencies).map(name => ({
    selector: new RegExp(`^${name}((/.+)|$)`),
    name,
    version: presetDependencies[name],
  }));

  // 忽略依赖
  const ignoreDependencyNameRules = ignoreDependencies.map(item => {
    if (typeof item === 'string') {
      return {
        selector: new RegExp(`^${item}((/.+)|$)`),
        name: item,
        version: 'latest',
      };
    } else {
      return {
        selector: new RegExp(`^${item.name}((/.+)|$)`),
        name: item.name,
        version: item.version,
      };
    }
  });

  // 1、定位到 h4 + hr 的位置
  // 2、将 demo 相关内容从 content 中移除
  // 3、解析移除的内容并添加值 demos 中
  let delLength = 0;
  const demos: IAppendsDemo[] = getDemoRanges(content).map(({ start, end }) => {
    const offsetStart = start - delLength;
    const offsetEnd = end - delLength;
    const [, demoNode] = content[offsetEnd];
    const dirPath = path.dirname(fileAbsolutePath);
    const { src, ...rest } = getAttributes(demoNode);

    const demoCodeAbsolutePath = path.join(dirPath, src);
    const { code, highlight } = getDemoCodeAndHighlight(demoCodeAbsolutePath);
    setAttribute(highlight, 'className', `${clsPrefix}-demo-wrap`);

    const info: IAppendsDemo = {
      title: content[offsetStart],
      // start + 2 这其中的 +2 代表的是 hr 标签
      content: content.slice(offsetStart + 2, offsetEnd),
      attributes: { src: demoCodeAbsolutePath, ...rest },
      code,
      highlight,
    };
    const extname = path.extname(demoCodeAbsolutePath);

    if (['.ts', '.tsx', '.js', '.jsx'].includes(extname)) {
      const demoDirPath = path.dirname(demoCodeAbsolutePath);
      const dependencies = getDemoCodeDependencies(code, {
        filename: `file${extname}`,
        ...babelConfig,
      });

      info.dependencies = R.pipe<
        string[],
        (IDependencyFile | null)[],
        any[],
        IDependencyFile[],
        IDependencyFile[]
      >(
        R.map<string, IDependencyFile | null>(dep => {
          const isLocal = /^\./.test(dep);

          if (isLocal) {
            const local = getDemoCodeLocal(dep, demoDirPath, undefined, resolveExtensions);

            return { type: 'local', ...local };
          }

          const [ignoredDep] = ignoreDependencyNameRules.filter(({ selector }) =>
            selector.test(dep)
          );

          // 若为忽略配置,则返回 latest 版本
          if (ignoredDep) {
            return {
              type: 'package',
              name: ignoredDep.name,
              version: ignoredDep.version,
            };
          }

          if (presetDependencies) {
            // 通过选择器获取预设依赖配置
            const [presetDep] = presetDependencyNameRules.filter(({ selector }) =>
              selector.test(dep)
            );

            // 若存在依赖配置则返回
            if (presetDep) {
              return null;
            }
          }
          const pkg = getDependenciesVersion(dep);

          return { type: 'package', ...pkg };
        }),
        // 移除 null
        R.filter(i => !!i),
        R.concat<IDependencyPackage>(
          presetDependencyNameRules.map(({ name, version }) => ({ type: 'package', name, version }))
        ),
        R.uniq
      )(dependencies);
    }

    // 若存在 code, 则生成 沙箱代码
    if (info.code) {
      info.sandboxCode = genSandboxCode(info.code, info.dependencies);
    }

    delLength = delLength + content.splice(offsetStart, offsetEnd - offsetStart + 1).length;

    return info;
  });

  markdownData.content = content;
  (markdownData as IMarkdownDataAppendDemo).demos = demos;

  if (Array.isArray(demos) && demos.length) {
    (markdownData as IMarkdownDataAppendDemo).demosToc = genTocJsonML(
      clsPrefix,
      demos.map(item => {
        const node = item.title;
        const tagName = getTagName(node);
        const headingNodeChildren = getChildren(node);

        const headingText = headingNodeChildren
          .map((node: any) => {
            if (isElement(node)) {
              if (hasAttributes(node)) {
                return node[2] || '';
              }
              return node[1] || '';
            }
            return node;
          })
          .join('');
        const headingTextId = headingText.trim().replace(/\s+/g, '-');

        return {
          tag: tagName,
          text: headingText,
          id: headingTextId,
          node: headingNodeChildren,
        };
      })
    );
  }

  return markdownData;
}

export default (options: IDataAppendOptions) => (markdownData: IMarkdownData) =>
  transform(markdownData, options);
