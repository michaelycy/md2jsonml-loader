const { parse } = require('@babel/core');

const a = parse(
  `
import React from 'react';

export default () => {
  return <a></a>;
};
`,
  {
    filename: 'file.ts',
    babelrc: false,
    configFile: false,
    presets: ['@babel/preset-react'],
  }
);
 console.log('a: ', a);
