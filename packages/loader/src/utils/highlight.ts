import Prism from './prism';
import jsonMLUtils from 'jsonml.js/lib/utils';
import { IMTResult } from 'md2jsonml-core';

const { getChildren, getAttributes, isElement } = jsonMLUtils;

const getCode = (node: any) => getChildren(getChildren(node)[0] || '')[0] || '';

/**
 * 高亮语法
 * @param node 节点
 */
export function highlight(node: any) {
  if (!isElement(node)) {
    return;
  }

  if (jsonMLUtils.getTagName(node) !== 'pre') {
    getChildren(node).forEach(highlight);
    return;
  }

  let language = Prism.languages[getAttributes(node).lang];

  if (!language) {
    language = Prism.languages.autoit || {};
  }

  const highlightCode = Prism.highlight(getCode(node), language || {}, getAttributes(node).lang);
  getAttributes(node).highlighted = highlightCode;
}

export default () => (markdownData: IMTResult) => {
  highlight(markdownData.content);

  return markdownData;
};
