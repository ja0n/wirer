var webpack = require('webpack');

module.exports = {
  entry: "./src/entry.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /(node_modules|bower_components)/, loader: 'babel?presets[]=es2015' }
      // { test: /\.css$/, loader: "style!css" },
    ],
  },
  plugins: []
};
