"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const utils = require("./utils.cjs");
function buildProcessOptions(opts, override) {
  const { colorCount, quantizer, generators, filters } = opts;
  const commonQuantizerOpts = { colorCount };
  const q = typeof quantizer === "string" ? { name: quantizer, options: {} } : quantizer;
  q.options = utils.assignDeep({}, commonQuantizerOpts, q.options);
  return utils.assignDeep(
    {},
    {
      quantizer: q,
      generators,
      filters
    },
    override
  );
}
exports.buildProcessOptions = buildProcessOptions;
//# sourceMappingURL=options.cjs.map
