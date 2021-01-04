import jsonMLUtils from 'jsonml.js/lib/utils';

export interface IOptions {
  maxDepth?: 1 | 2 | 3 | 4 | 5 | 6;
  keepElem?: boolean;
  clsPrefix?: string;
}

const isHeading = (tagname: string) => /^h[1-6]$/i.test(tagname);
const hasAttributes = (jml: any) => Array.isArray(jml) && 'string' === typeof jml[0];

function transform(markdownData: any, config: IOptions = {}) {
  const maxDepth = config.maxDepth || 6;

  const listItems =
    hasAttributes(markdownData.content) &&
    jsonMLUtils
      .getChildren(markdownData.content)
      .filter((node: any) => {
        const tagName = jsonMLUtils.getTagName(node);
        return isHeading(tagName) && +tagName.charAt(1) <= maxDepth;
      })
      .map((node: any) => {
        const tagName = jsonMLUtils.getTagName(node);
        const headingNodeChildren = jsonMLUtils.getChildren(node);
        const headingText = headingNodeChildren
          .map((node: any) => {
            if (jsonMLUtils.isElement(node)) {
              if (jsonMLUtils.hasAttributes(node)) {
                return node[2] || '';
              }
              return node[1] || '';
            }
            return node;
          })
          .join('');

        const headingTextId = headingText.trim().replace(/\s+/g, '-');

        return [
          'li',
          [
            'a',
            {
              className: `_toc-${tagName}`,
              href: `#${headingTextId}`,
              title: headingText,
            },
          ].concat(config.keepElem ? headingNodeChildren : [headingText]),
        ];
      });

  markdownData.toc = ['ul'].concat(listItems);

  return markdownData;
}

export default transform;
