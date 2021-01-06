const custom = require('../webpack.config.js');

module.exports = {
  stories: ['../**/*.stories.js'],
  webpackFinal: (config) => {
    config.module.rules.push(custom.module.rules[0])
    return config
  },
};