import Prism from 'node-prismjs';
import jsonMLUtils from 'jsonml.js/lib/utils';
import { IMTResult } from 'md2jsonml-core';

const { getChildren, getAttributes, isElement } = jsonMLUtils;

const getCode = (node: any) => getChildren(getChildren(node)[0] || '')[0] || '';

/**
 * 高亮语法
 * @param node 节点
 */
function highlight(node: any) {
  if (!isElement(node)) {
    return;
  }

  if (jsonMLUtils.getTagName(node) !== 'pre') {
    getChildren(node).forEach(highlight);
    return;
  }

  var language = Prism.languages[getAttributes(node).lang] || Prism.languages.autoit;
  getAttributes(node).highlighted = Prism.highlight(getCode(node), language);
}

export default (markdownData: IMTResult) => {
  highlight(markdownData.content);

  return markdownData;
};
