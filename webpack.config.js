var webpack = require('webpack');
var path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/Sticky.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: 'sticky.js',
    library: 'Sticky',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devServer: {
    contentBase: [path.join(__dirname, 'examples'), path.join(__dirname, 'dist')],
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      { test: /\.tsx?$/, exclude: /(node_modules)/, loader: "awesome-typescript-loader" },
      { test: /\.js?$/, exclude: /(node_modules)/, loader: 'babel-loader' },
      { test: /\.js?$/, exclude: /(node_modules)/, loader: 'source-map-loader', enforce: 'pre' },
      // { test: /\.css$/, loader: "style-loader!css" },
    ]
  }
};