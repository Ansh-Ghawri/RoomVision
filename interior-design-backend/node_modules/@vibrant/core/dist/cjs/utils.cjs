"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
function mapValues(o, mapper) {
  const result = {};
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      const v = o[key];
      if (!v) continue;
      result[key] = mapper(v);
    }
  }
  return result;
}
function assignDeep(target, ...sources) {
  sources.forEach((s) => {
    if (!s) return;
    for (const key in s) {
      if (s.hasOwnProperty(key)) {
        const v = s[key];
        if (Array.isArray(v)) {
          target[key] = v.slice(0);
        } else if (typeof v === "object") {
          if (!target[key]) target[key] = {};
          assignDeep(target[key], v);
        } else {
          target[key] = v;
        }
      }
    }
  });
  return target;
}
exports.assignDeep = assignDeep;
exports.mapValues = mapValues;
//# sourceMappingURL=utils.cjs.map
