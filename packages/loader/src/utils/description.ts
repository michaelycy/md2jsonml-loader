import jsonMLUtils from 'jsonml.js/lib/utils';
import { isHeading } from '.';

const { getChildren, getTagName, getAttributes } = jsonMLUtils;

export default () => (markdownData: any) => {
  const { content } = markdownData;
  const children = getChildren(content);
  const hrIndex = children.findIndex((node: any) => getTagName(node) === 'hr');
  const prevNode = children[hrIndex - 1];

  // 第一个换行符 && 上一个节点必须是非 heading 的之前的内容为简介信息
  if (hrIndex >= 1 && !isHeading(getTagName(prevNode))) {
    markdownData.description = ['section'].concat(children.slice(0, hrIndex));

    markdownData.content = [getTagName(content), getAttributes(content, undefined) || {}].concat(
      children.slice(hrIndex + 1)
    );
  }

  return markdownData;
};
