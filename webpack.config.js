var webpack = require('webpack');

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
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
      // { test: /\.css$/, loader: "style-loader!css" },
    ]
  }
};
