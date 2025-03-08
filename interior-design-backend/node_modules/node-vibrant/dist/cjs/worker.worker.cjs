"use strict";
const core = require("@vibrant/core");
const index = require("./pipeline/index.cjs");
core.runPipelineInWorker(self, index.pipeline);
//# sourceMappingURL=worker.worker.cjs.map
