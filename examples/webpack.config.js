const path = require('path');
const tocPluginProd = require('md2jsonml-plugin-toc');
const apiPluginProd = require('md2jsonml-plugin-api');
const descPluginProd = require('md2jsonml-plugin-description');
const highlightPluginProd = require('md2jsonml-plugin-highlight');

const loader = path.resolve(__dirname, '../packages', 'loader', 'lib', 'index.js');
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

const babelPlugin = path.resolve(__dirname, '../packages', 'babel-plugin-react', 'lib', 'index.js');

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
      // {
      //   test: /\.(js|mjs|jsx|ts|tsx)$/,
      //   exclude: /node_modules/,
      //   loader: require.resolve('babel-loader'),
      //   options: {
      //     // presets: ['react-app'],
      //     plugins: [],
      //   },
      // },
      {
        test: /\.md?$/,
        // loader: 'webpack-md2jsonml-loader',
        loader: loader,
        options: {
          // plugins: [tocPluginProd, apiPluginProd, descPluginProd, highlightPluginProd],
          plugins: [
            require(tocPlugin).default({
              maxDepth: 2,
              clsPrefix: 'hs',
            }),
            require(descPlugin).default(),
            require(highlightPlugin).default(),
            require(apiPlugin).default(),
          ],
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
