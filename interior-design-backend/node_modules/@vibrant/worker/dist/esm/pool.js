import { defer } from "@vibrant/types";
const MAX_WORKER_COUNT = 5;
class WorkerPool {
  constructor(WorkerClass) {
    this.WorkerClass = WorkerClass;
    this._taskId = 0;
    this._workers = [];
    this._queue = [];
    this._executing = {};
  }
  _findIdleWorker() {
    let worker;
    if (this._workers.length === 0 || this._workers.length < MAX_WORKER_COUNT) {
      worker = new this.WorkerClass();
      worker.id = this._workers.length;
      worker.idle = true;
      this._workers.push(worker);
      worker.onmessage = this._onMessage.bind(this, worker.id);
    } else {
      worker = this._workers.find(({ idle }) => idle);
    }
    return worker;
  }
  _enqueue(payload, transferList) {
    const d = defer();
    const task = {
      id: this._taskId++,
      payload,
      transferList,
      deferred: d
    };
    this._queue.push(task);
    this._tryDequeue();
    return d.promise;
  }
  _tryDequeue() {
    if (this._queue.length <= 0) return;
    const worker = this._findIdleWorker();
    if (!worker) return;
    const task = this._queue.shift();
    this._executing[task.id] = task;
    const transfers = task.transferList;
    const { deferred, transferList, ...request } = task;
    worker.postMessage(request, transfers);
    worker.idle = false;
  }
  _onMessage(workerId, event) {
    const data = event.data;
    if (!data) return;
    const { id } = data;
    const task = this._executing[id];
    if (!task) return;
    delete this._executing[id];
    switch (data.type) {
      case "return":
        task.deferred.resolve(data.payload);
        break;
      case "error":
        task.deferred.reject(new Error(data.payload));
        break;
    }
    const worker = this._workers[workerId];
    if (!worker) return;
    worker.idle = true;
    this._tryDequeue();
  }
  invoke(args, transferList) {
    return this._enqueue(args, transferList);
  }
}
export {
  WorkerPool
};
//# sourceMappingURL=pool.js.map
