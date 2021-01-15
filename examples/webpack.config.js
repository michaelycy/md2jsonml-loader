const path = require('path');
const tocPluginProd = require('md2jsonml-plugin-toc');
const apiPluginProd = require('md2jsonml-plugin-api');
const descPluginProd = require('md2jsonml-plugin-description');
const highlightPluginProd = require('md2jsonml-plugin-highlight');

const loader = path.resolve(__dirname, '../packages', 'loader', 'lib', 'index.js');
// const { MD2JsonmlAppendDemoPlugin } = require(path.resolve(
//   __dirname,
//   '../packages',
//   'loader',
//   'lib',
//   'index.js'
// ));

// const babelPlugin = path.resolve(__dirname, '../packages', 'babel-plugin-react', 'lib', 'index.js');

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
          clsPrefix: 'hs',
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@/t': path.resolve(__dirname, '.'),
    },
  },
  plugins: [
    // new MD2JsonmlAppendDemoPlugin({
    //   a: 1,
    // }),
  ],
};
