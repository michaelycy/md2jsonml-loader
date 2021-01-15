import jsonMLUtils from 'jsonml.js/lib/utils';
import { isHeading } from '.';

export interface ITocOptions {
  maxDepth?: 1 | 2 | 3 | 4 | 5 | 6;
  keepElem?: boolean;
  clsPrefix?: string;
}

const { getTagName, getChildren, isElement } = jsonMLUtils;
const hasAttributes = (jml: any) => Array.isArray(jml) && 'string' === typeof jml[0];

function transform(markdownData: any, config: ITocOptions = {}) {
  const { maxDepth = 2, keepElem, clsPrefix } = config;

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

export default (config: ITocOptions = {}) => (markdownData: any) => transform(markdownData, config);
