import fs from 'fs';
import path from 'path';
import { parse } from '@babel/core';
import jsonMLUtils from 'jsonml.js/lib/utils';
import { transform } from 'md2jsonml-core';
import { highlight } from './highlight';
import { File } from '@babel/types';

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
        if (contentLength - 1 === nextIndex) {
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
export const getDemoCodeDependencies = (code: string) => {
  const codeAst = parse(code, {});
  let dependencies: string[] = [];

  if (codeAst) {
    const { program } = codeAst as File;

    dependencies = program.body
      .filter(({ type }) => type === 'ImportDeclaration')
      .map((item: any) => item.source.value);
  }

  return dependencies;
};
