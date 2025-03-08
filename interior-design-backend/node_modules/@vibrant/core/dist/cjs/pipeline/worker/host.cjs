"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const worker = require("@vibrant/worker");
function runPipelineInWorker(self, pipeline) {
  worker.runInWorker(self, (imageData, opts) => pipeline.process(imageData, opts));
}
exports.runPipelineInWorker = runPipelineInWorker;
//# sourceMappingURL=host.cjs.map
