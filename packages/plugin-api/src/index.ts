import jsonMLUtils from 'jsonml.js/lib/utils';

const { getChildren, getTagName } = jsonMLUtils;

export default (markdownData: any) => {
  const { content } = markdownData;
  const contentChildren = getChildren(content);
  const apiStarIndex = contentChildren.findIndex(
    (node: any) => getTagName(node) === 'h2' && /^API/.test(getChildren(node)[0])
  );

  if (apiStarIndex >= 0) {
    const updatedContent = contentChildren.slice(0, apiStarIndex);
    markdownData.content = updatedContent;

    const api = contentChildren.slice(apiStarIndex);
    markdownData.api = api;
  }

  return markdownData;
};
