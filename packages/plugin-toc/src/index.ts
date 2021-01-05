import jsonMLUtils from 'jsonml.js/lib/utils';

export interface IOptions {
  maxDepth?: 1 | 2 | 3 | 4 | 5 | 6;
  keepElem?: boolean;
  clsPrefix?: string;
}

const { getTagName, getChildren, isElement } = jsonMLUtils;
const isHeading = (tagname: string) => /^h[1-6]$/i.test(tagname);
const hasAttributes = (jml: any) => Array.isArray(jml) && 'string' === typeof jml[0];

function transform(markdownData: any, config: IOptions = {}) {
  const { maxDepth = 6, keepElem, clsPrefix } = config;

  const listItems =
    hasAttributes(markdownData.content) &&
    getChildren(markdownData.content)
      .filter((node: any) => {
        const tagName = getTagName(node);
        return isHeading(tagName) && +tagName.charAt(1) <= maxDepth;
      })
      .map((node: any) => {
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

        return [
          'li',
          {
            className: `${clsPrefix}-toc-li toc-li`,
          },
          [
            'a',
            {
              className: `${clsPrefix}-toc-${tagName}`,
              href: `#${headingTextId}`,
              title: headingText,
            },
          ].concat(keepElem ? headingNodeChildren : [headingText]),
        ];
      });

  markdownData.toc = ['ul', { className: `${clsPrefix}-toc-ul toc-ul` }].concat(listItems);

  return markdownData;
}

export default (config: IOptions = {}) => (markdownData: any) => transform(markdownData, config);
