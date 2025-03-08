import { assignDeep } from "./utils.js";
function buildProcessOptions(opts, override) {
  const { colorCount, quantizer, generators, filters } = opts;
  const commonQuantizerOpts = { colorCount };
  const q = typeof quantizer === "string" ? { name: quantizer, options: {} } : quantizer;
  q.options = assignDeep({}, commonQuantizerOpts, q.options);
  return assignDeep(
    {},
    {
      quantizer: q,
      generators,
      filters
    },
    override
  );
}
export {
  buildProcessOptions
};
//# sourceMappingURL=options.js.map
