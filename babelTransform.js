const babelJest = require("babel-jest").default;

module.exports = {
  process(sourceText, sourcePath, options) {
    const alias = options?.config?.moduleNameMapper;
    const extensions = options.config.moduleFileExtensions;
    const babelTransformer = babelJest.createTransformer({
     presets: [
        ["@babel/preset-react", { runtime: "automatic" }], // Ensuring JSX transform
        ["@babel/preset-env"],
        ["@babel/preset-typescript", { isTSX: true, allExtensions: true }] // Adjusted for TSX
      ],
      plugins: [["transform-barrels", { executorName: "jest", alias: alias, extensions: extensions }]],
      babelrc: false,
      configFile: false,
    });
    return babelTransformer.process(sourceText, sourcePath, options);
  },
};
