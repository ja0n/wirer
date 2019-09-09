const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
      { test: require.resolve('leader-line'), loader: 'script-loader' },
      { test: /\.tsx?$/, exclude: /(node_modules)/, loader: "awesome-typescript-loader" },
      { test: /\.js?$/, exclude: /(node_modules)/, loader: 'babel-loader' },
      { test: /\.js?$/, exclude: /(node_modules)/, loader: 'source-map-loader', enforce: 'pre' },
      // { test: /\.css$/, loader: "style-loader!css" },
      {
        test: /\.(scss|css)$/,
        use: [
          // fallback to style-loader in development
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};