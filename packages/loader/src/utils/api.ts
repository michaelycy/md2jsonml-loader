import jsonMLUtils from 'jsonml.js/lib/utils';

export default () => (markdownData: any) => {
  const { content } = markdownData;
  const contentChildren = jsonMLUtils.getChildren(content);
  const apiStarIndex = contentChildren.findIndex(
    (node: any) =>
      jsonMLUtils.getTagName(node) === 'h2' && /^API/.test(jsonMLUtils.getChildren(node)[0])
  );

  if (apiStarIndex >= 0) {
    const updatedContent = contentChildren.slice(0, apiStarIndex);
    markdownData.content = updatedContent;

    const api = contentChildren.slice(apiStarIndex);
    markdownData.api = api;
  }

  return markdownData;
};
