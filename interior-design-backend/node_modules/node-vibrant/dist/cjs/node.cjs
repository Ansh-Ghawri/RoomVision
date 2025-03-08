"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const imageNode = require("@vibrant/image-node");
require("./configs/config.cjs");
const index = require("./pipeline/index.cjs");
const core = require("@vibrant/core");
core.Vibrant.DefaultOpts.ImageClass = imageNode.NodeImage;
core.Vibrant.use(index.pipeline);
Object.defineProperty(exports, "Vibrant", {
  enumerable: true,
  get: () => core.Vibrant
});
//# sourceMappingURL=node.cjs.map
