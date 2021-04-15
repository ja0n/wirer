
module.exports = api => {
  const isTest = api.env('test');
  // You can use isTest to determine what presets and plugins to use.

  return {
    "presets": [
      ["@babel/preset-env", isTest ? { targets: { node: 'current' } } : {}],
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    "plugins": [
      "add-module-exports",
      ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
  };
};