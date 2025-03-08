"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
class PQueue {
  _sort() {
    if (!this._sorted) {
      this.contents.sort(this._comparator);
      this._sorted = true;
    }
  }
  constructor(comparator) {
    this._comparator = comparator;
    this.contents = [];
    this._sorted = false;
  }
  push(item) {
    this.contents.push(item);
    this._sorted = false;
  }
  peek(index) {
    this._sort();
    index = typeof index === "number" ? index : this.contents.length - 1;
    return this.contents[index];
  }
  pop() {
    this._sort();
    return this.contents.pop();
  }
  size() {
    return this.contents.length;
  }
  map(mapper) {
    this._sort();
    return this.contents.map(mapper);
  }
}
exports.PQueue = PQueue;
//# sourceMappingURL=pqueue.cjs.map
