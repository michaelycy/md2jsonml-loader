import path from 'path';
import { getOptions } from 'loader-utils';
import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';

// import PluginDemo from './plugins/demo';
import { transform } from 'md2jsonml-core';
import schema from './schema';
import { IMarkdownData } from './types';
import apiUtils from './utils/api';
import appendDemoUtils from './utils/append-demo';
import descriptionUtils from './utils/description';
import highlightUtils from './utils/highlight';
import tocUtils from './utils/toc';

interface IOptions {
  clsPrefix?: string;
  tocMaxDepth?: 1 | 2 | 3 | 4 | 5 | 6;
  tocKeepElem?: boolean;
}

/**
 * markdown jsonML
 * @param this loader 上下文
 * @param source The Markdown source.
 */
export default function loader(this: any, source: string) {
  const options: IOptions = getOptions(this || { clsPrefix: 'md' });
  // 校验参数
  validate(schema as Schema, options, { name: 'webpack-md2jsonml-loader' });
  const { clsPrefix, tocKeepElem, tocMaxDepth } = options;

  // 获取文件路径
  const { resourcePath, rootContext } = this as any;
  // 获取文件在项目中的路径
  const transformed = (resourcePath as string).replace(new RegExp(rootContext), '');
  // 获取到文件相对路径,并且追加绝对路径
  const result: IMarkdownData = {
    filepath: path.isAbsolute(transformed) ? `.${transformed}` : transformed,
    fileAbsolutePath: resourcePath,
    ...transform(source),
  };

  // 次顺序不可以调整
  [
    descriptionUtils(),
    appendDemoUtils(),
    highlightUtils(),
    tocUtils({ maxDepth: tocMaxDepth, keepElem: tocKeepElem, clsPrefix }),
    apiUtils(),
  ].forEach((plg: (...args: any) => void) => plg(result));

  return `export default ${JSON.stringify(result)}`;
}

// export const MD2JsonmlAppendDemoPlugin = PluginDemo;
