"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const worker = require("@vibrant/worker");
const color = require("@vibrant/color");
const utils = require("../../utils.cjs");
class WorkerPipeline {
  constructor(PipelineWorker) {
    this.PipelineWorker = PipelineWorker;
    this._manager = new worker.WorkerManager();
    this._manager.register("pipeline", PipelineWorker);
  }
  _rehydrate(result) {
    const { colors, palettes } = result;
    result.colors = colors.map((s) => color.Swatch.clone(s));
    result.palettes = utils.mapValues(
      palettes,
      (p) => utils.mapValues(p, (c) => c ? color.Swatch.clone(c) : null)
    );
    return result;
  }
  async process(imageData, opts) {
    const result = await this._manager.invokeWorker(
      "pipeline",
      [imageData, opts],
      [imageData.data.buffer]
    );
    return this._rehydrate(result);
  }
}
exports.WorkerPipeline = WorkerPipeline;
//# sourceMappingURL=client.cjs.map
