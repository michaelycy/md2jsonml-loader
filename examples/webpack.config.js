const path = require('path');

const dir = path.resolve(__dirname, '../packages', 'loader', 'lib', 'index.js');
const tocPlugin = path.resolve(__dirname, '../packages', 'plugin-toc', 'lib', 'index.js');
const apiPlugin = path.resolve(__dirname, '../packages', 'plugin-api', 'lib', 'index.js');
const descPlugin = path.resolve(__dirname, '../packages', 'plugin-description', 'lib', 'index.js');
const highlightPlugin = path.resolve(
  __dirname,
  '../packages',
  'plugin-highlight',
  'lib',
  'index.js'
);

module.exports = {
  mode: 'development',
  context: __dirname,
  devtool: 'inline-source-map',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.md?$/,
        loader: dir,
        options: {
          plugins: [tocPlugin, apiPlugin, descPlugin, highlightPlugin],
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@/t': path.resolve(__dirname, '.'),
    },
  },
};
