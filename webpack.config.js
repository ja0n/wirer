var webpack = require('webpack');

module.exports = {
  entry: "./src/entry.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        },
        "plugins": ["syntax-object-rest-spread", "transform-function-bind"]
      }
      // { test: /\.css$/, loader: "style!css" },
    ]
  },
  plugins: []
};
