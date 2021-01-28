const path = require('path');
const loader = path.resolve(__dirname, '../packages', 'loader', 'lib', 'index.js');
// const { CodeParsePlugin } = require('../packages/loader/lib/plugins/index');

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
          // clsPrefix: 'hs',
          demoIgnoreDependencies: ['@shuyun-ep-team/kylin-ui'],
          demoPresetDependencies: { react: '^16.8.0' },
        },
      },
    ],
  },
  // plugins: [new CodeParsePlugin()],
};
