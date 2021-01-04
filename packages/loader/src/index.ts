import path from 'path';
import { getOptions } from 'loader-utils';
import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';

import { transform } from 'md2jsonml-core';
import schema from './schema';

interface IOptions {
  plugins?: string[];
}

/**
 * markdown jsonML
 * @param this loader 上下文
 * @param source The Markdown source.
 */
export default function loader(this: any, source: string) {
  const options: IOptions = getOptions(this || {});
  // 校验参数
  validate(schema as Schema, options, { name: 'webpack-md2jsonml-loader' });

  // 获取文件路径
  const { resourcePath, rootContext } = this as any;
  const { plugins = [] } = options;

  const transformed = (resourcePath as string).replace(new RegExp(rootContext), '');
  console.log('resourcePath: ', path.isAbsolute(transformed) ? `.${transformed}` : transformed);
  // const context
  const result = transform(source);

  plugins.forEach((plg: string | ((...args: any) => void)) => {
    if (typeof plg === 'string') {
      const pluginFunc = require(plg).default;
      pluginFunc(result);
    } else if (typeof plg === 'function') {
      plg(result);
    }
  });

  return `export default ${JSON.stringify(result)}`;
}
