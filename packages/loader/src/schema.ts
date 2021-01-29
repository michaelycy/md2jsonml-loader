import { Schema } from 'schema-utils/declarations/validate';
import { resolveExtensions } from './constant/resolve-demo';

export const loaderOptions = {
  type: 'object',
  properties: {
    clsPrefix: { type: 'string', default: 'ky' },
    tocMaxDepth: { type: 'number', enum: [1, 2, 3, 4, 5, 6] },
    tocKeepElem: { type: 'boolean' },
    demoBabelConfig: { type: 'boolean' },
    demoResolveExtensions: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
      default: resolveExtensions,
    },
    demoIgnoreDependencies: {
      type: 'array',
      uniqueItems: true,
      description: 'Demo 代码中需要忽略的依赖配置',
      items: {
        oneOf: [
          {
            type: 'string',
          },
          {
            type: 'object',
            properties: {
              name: { type: 'string' },
              version: { type: 'string' },
            },
          },
        ],
      },
      default: [],
    },
    demoPresetDependencies: {
      type: 'object',
      description: 'Demo 代码中需要预设的依赖配置',
    },
  },
  additionalProperties: false,
} as Schema;
