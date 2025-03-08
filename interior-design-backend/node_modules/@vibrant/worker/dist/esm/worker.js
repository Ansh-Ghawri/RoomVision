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
export {
  runInWorker
};
//# sourceMappingURL=worker.js.map
