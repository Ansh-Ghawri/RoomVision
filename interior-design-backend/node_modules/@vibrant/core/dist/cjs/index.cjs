"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const options = require("./options.cjs");
const builder = require("./builder.cjs");
const utils = require("./utils.cjs");
const index = require("./pipeline/index.cjs");
const client = require("./pipeline/worker/client.cjs");
const host = require("./pipeline/worker/host.cjs");
const _Vibrant = class _Vibrant {
  /**
   *
   * @param _src Path to image file (supports HTTP/HTTPs)
   * @param opts Options (optional)
   */
  constructor(_src, opts) {
    this._src = _src;
    this.opts = utils.assignDeep({}, _Vibrant.DefaultOpts, opts);
  }
  static use(pipeline) {
    this._pipeline = pipeline;
  }
  static from(src) {
    return new builder.Builder(src);
  }
  get result() {
    return this._result;
  }
  _process(image, opts) {
    image.scaleDown(this.opts);
    const processOpts = options.buildProcessOptions(this.opts, opts);
    return _Vibrant._pipeline.process(image.getImageData(), processOpts);
  }
  async getPalette() {
    const image = new this.opts.ImageClass();
    try {
      const image1 = await image.load(this._src);
      const result1 = await this._process(image1, {
        generators: ["default"]
      });
      this._result = result1;
      const res = result1.palettes["default"];
      if (!res) {
        throw new Error(
          `Something went wrong and a palette was not found, please file a bug against our GitHub repo: https://github.com/vibrant-Colors/node-vibrant/`
        );
      }
      image.remove();
      return res;
    } catch (err) {
      image.remove();
      return Promise.reject(err);
    }
  }
  async getPalettes() {
    const image = new this.opts.ImageClass();
    try {
      const image1 = await image.load(this._src);
      const result1 = await this._process(image1, {
        generators: ["*"]
      });
      this._result = result1;
      const res = result1.palettes;
      image.remove();
      return res;
    } catch (err) {
      image.remove();
      return Promise.reject(err);
    }
  }
};
_Vibrant.DefaultOpts = {
  colorCount: 64,
  quality: 5,
  filters: []
};
let Vibrant = _Vibrant;
exports.Builder = builder.Builder;
exports.BasicPipeline = index.BasicPipeline;
exports.WorkerPipeline = client.WorkerPipeline;
exports.runPipelineInWorker = host.runPipelineInWorker;
exports.Vibrant = Vibrant;
//# sourceMappingURL=index.cjs.map
