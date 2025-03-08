"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
function runInWorker(self, fn) {
  self.onmessage = (event) => {
    const data = event.data;
    const { id, payload } = data;
    Promise.resolve(fn(...payload)).then((ret) => {
      self.postMessage({
        id,
        type: "return",
        payload: ret
      });
    }).catch((e) => {
      self.postMessage({
        id,
        type: "error",
        payload: e.message
      });
    });
  };
}
exports.runInWorker = runInWorker;
//# sourceMappingURL=worker.cjs.map
