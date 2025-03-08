"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const pool = require("./pool.cjs");
const worker = require("./worker.cjs");
class WorkerManager {
  constructor() {
    this._pools = {};
  }
  register(name, WorkerClass) {
    this._pools[name] = new pool.WorkerPool(WorkerClass);
  }
  hasWorker(name) {
    return !!this._pools[name];
  }
  getWorker(name) {
    return this._pools[name];
  }
  invokeWorker(name, args, transferList) {
    return this.hasWorker(name) ? this.getWorker(name).invoke(args, transferList) : Promise.reject(`Worker '${name}' does not exist`);
  }
}
exports.runInWorker = worker.runInWorker;
exports.WorkerManager = WorkerManager;
//# sourceMappingURL=index.cjs.map
