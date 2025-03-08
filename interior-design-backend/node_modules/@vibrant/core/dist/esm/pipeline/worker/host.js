import { runInWorker } from "@vibrant/worker";
function runPipelineInWorker(self, pipeline) {
  runInWorker(self, (imageData, opts) => pipeline.process(imageData, opts));
}
export {
  runPipelineInWorker
};
//# sourceMappingURL=host.js.map
