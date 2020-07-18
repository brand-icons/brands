export default {
  files: [
    "src/__tests__/index.node.test.js",
    "util/helpers/__tests__/get-attributes.node.test.js",
  ],
  verbose: true,
  ignoredByWatcher: ["{coverage,examples/**"],
  require: ["esm"],
  nodeArguments: ["--experimental-modules"],
};
