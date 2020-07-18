export default {
  files: [
    "src/__tests__/index.test.js",
    "bin/__tests__/**",
    "util/helpers/__tests__/**",
  ],
  verbose: true,
  ignoredByWatcher: ["{coverage,examples/**"],
  require: ["esm", "./src/__tests__/_setup-browser-env.js"],
  nodeArguments: ["--experimental-modules"],
};
