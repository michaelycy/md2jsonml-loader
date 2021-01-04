import jsonMLUtils from 'jsonml.js/lib/utils';

const { getChildren, getTagName, getAttributes } = jsonMLUtils;

export default (markdownData: any) => {
  const { content } = markdownData;
  const contentChildren = getChildren(content);
  const dividerIndex = contentChildren.findIndex((node: any) => getTagName(node) === 'hr');

  if (dividerIndex >= 0) {
    markdownData.description = ['section'].concat(contentChildren.slice(0, dividerIndex));

    markdownData.content = [getTagName(content), getAttributes(content, undefined) || {}].concat(
      contentChildren.slice(dividerIndex + 1)
    );
  }

  return markdownData;
};
