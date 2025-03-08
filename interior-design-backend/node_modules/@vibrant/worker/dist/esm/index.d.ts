import { WorkerPool } from './pool.js';
import { TaskWorkerClass } from './common.js';
export declare class WorkerManager {
    private _pools;
    register(name: string, WorkerClass: TaskWorkerClass): void;
    hasWorker(name: string): boolean;
    getWorker(name: string): WorkerPool | undefined;
    invokeWorker<R>(name: string, args: any[], transferList?: any[]): Promise<R>;
}
export * from './worker.js';
export * from './common.js';
