"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const quantizerMmcq = require("@vibrant/quantizer-mmcq");
const generatorDefault = require("@vibrant/generator-default");
const core = require("@vibrant/core");
const pipeline = new core.BasicPipeline().filter.register(
  "default",
  (r, g, b, a) => a >= 125 && !(r > 250 && g > 250 && b > 250)
).quantizer.register("mmcq", quantizerMmcq.MMCQ).generator.register("default", generatorDefault.DefaultGenerator);
exports.pipeline = pipeline;
//# sourceMappingURL=index.cjs.map
