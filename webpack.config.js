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
    publicPath: 'build',
    contentBase: [path.join(__dirname, 'examples'), path.join(__dirname, 'dist')],
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
      // { test: /\.css$/, loader: "style-loader!css" },
    ]
  }
};