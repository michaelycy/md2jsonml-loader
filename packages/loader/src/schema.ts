import { Schema } from 'schema-utils/declarations/validate';

export default {
  type: 'object',
  properties: {
    clsPrefix: { type: 'string' },
    tocMaxDepth: { type: 'number', enum: [1, 2, 3, 4, 5, 6] },
    tocKeepElem: { type: 'boolean' },
  },
  additionalProperties: false,
} as Schema;
