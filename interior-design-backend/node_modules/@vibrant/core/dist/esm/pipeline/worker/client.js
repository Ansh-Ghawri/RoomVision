import { WorkerManager } from "@vibrant/worker";
import { Swatch } from "@vibrant/color";
import { mapValues } from "../../utils.js";
class WorkerPipeline {
  constructor(PipelineWorker) {
    this.PipelineWorker = PipelineWorker;
    this._manager = new WorkerManager();
    this._manager.register("pipeline", PipelineWorker);
  }
  _rehydrate(result) {
    const { colors, palettes } = result;
    result.colors = colors.map((s) => Swatch.clone(s));
    result.palettes = mapValues(
      palettes,
      (p) => mapValues(p, (c) => c ? Swatch.clone(c) : null)
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
export {
  WorkerPipeline
};
//# sourceMappingURL=client.js.map
