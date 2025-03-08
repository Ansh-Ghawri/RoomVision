"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
class Defer {
  constructor() {
    this.promise = new Promise((_resolve, _reject) => {
      this.resolve = _resolve;
      this.reject = _reject;
    });
  }
}
function defer() {
  return new Defer();
}
exports.Defer = Defer;
exports.defer = defer;
//# sourceMappingURL=index.cjs.map
