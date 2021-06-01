const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  entry: './src/Sticky',
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
      {
        test: require.resolve('leader-line/'),
        loader: 'skeleton-loader',
        options: { procedure: content => `${content} export default LeaderLine` }
      },
      { test: /\.tsx?$/, exclude: /(node_modules)/, loader: "ts-loader" },
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
