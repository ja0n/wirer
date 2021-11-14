const custom = require('../webpack.config.js');

module.exports = {
  addons: ['@storybook/addon-essentials'],
  stories: ['../stories/*.stories.@(js|tsx|mdx)', '../src/**/*.stories.@(js|tsx|mdx)'],
  core: {
    builder: "webpack5",
  },
  webpackFinal: (config) => {
    config.module.rules.push(custom.module.rules[0]);
    config.resolve.fallback = {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "readline": false,
    }
    return config;
  },
};
