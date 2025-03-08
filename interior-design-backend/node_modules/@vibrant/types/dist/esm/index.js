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
export {
  Defer,
  defer
};
//# sourceMappingURL=index.js.map
