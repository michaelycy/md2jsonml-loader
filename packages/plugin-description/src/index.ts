import jsonMLUtils from 'jsonml.js/lib/utils';

export default () => (markdownData: any) => {
  const { content } = markdownData;
  const contentChildren = jsonMLUtils.getChildren(content);
  const dividerIndex = contentChildren.findIndex((node: any) => jsonMLUtils.getTagName(node) === 'hr');

  if (dividerIndex >= 0) {
    markdownData.description = ['section'].concat(contentChildren.slice(0, dividerIndex));

    markdownData.content = [jsonMLUtils.getTagName(content), jsonMLUtils.getAttributes(content, undefined) || {}].concat(
      contentChildren.slice(dividerIndex + 1)
    );
  }

  return markdownData;
};
