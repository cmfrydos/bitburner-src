const babelJest = require("babel-jest").default;

module.exports = {
  process(sourceText, sourcePath, options) {
    const alias = options?.config?.moduleNameMapper;
    const extensions = options.config.moduleFileExtensions;
    const babelTransformer = babelJest.createTransformer({
      presets: [["@babel/preset-react"], ["@babel/preset-env"], ["@babel/preset-typescript"]],
      plugins: [
        ["transform-barrels", { executorName: "jest", alias: alias, extensions: extensions, isCacheEnabled: false }],
      ], // set to true when all else worked
      babelrc: false,
      configFile: false,
    });

    return babelTransformer.process(sourceText, sourcePath, options);
  },
};
