const custom = require('../webpack.config.js');

module.exports = {
  addons: ['@storybook/addon-essentials'],
  stories: ['../stories/*.stories.@(js|tsx|mdx)', '../src/**/*.stories.@(js|tsx|mdx)'],
  core: {
    builder: "webpack5",
  },
  webpackFinal: (config) => {
    config.module.rules.push(custom.module.rules[0]);
    return config;
  },
};
