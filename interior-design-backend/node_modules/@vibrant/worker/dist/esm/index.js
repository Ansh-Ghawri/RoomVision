import { WorkerPool } from "./pool.js";
import { runInWorker } from "./worker.js";
class WorkerManager {
  constructor() {
    this._pools = {};
  }
  register(name, WorkerClass) {
    this._pools[name] = new WorkerPool(WorkerClass);
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
export {
  WorkerManager,
  runInWorker
};
//# sourceMappingURL=index.js.map
