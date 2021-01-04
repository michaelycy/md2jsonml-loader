declare module 'node-prismjs';
declare module 'jsonml.js/lib/utils';
declare module 'mark-twain' {
  export interface MTResult {
    content: any;
    meta: {
      filepath?: string;
      readonly [key: string]: any;
      readonly __content: string;
    };
  }

  export function MT(markdown: string): MTResult;

  export default MT;
}
