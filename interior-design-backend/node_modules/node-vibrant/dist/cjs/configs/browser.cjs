"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const imageBrowser = require("@vibrant/image-browser");
require("./config.cjs");
const core = require("@vibrant/core");
core.Vibrant.DefaultOpts.ImageClass = imageBrowser.BrowserImage;
Object.defineProperty(exports, "Vibrant", {
  enumerable: true,
  get: () => core.Vibrant
});
//# sourceMappingURL=browser.cjs.map
