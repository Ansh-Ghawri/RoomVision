"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
require("./configs/browser.cjs");
const index = require("./pipeline/index.cjs");
require("./configs/config.cjs");
const core = require("@vibrant/core");
core.Vibrant.use(index.pipeline);
Object.defineProperty(exports, "Vibrant", {
  enumerable: true,
  get: () => core.Vibrant
});
//# sourceMappingURL=browser.cjs.map
