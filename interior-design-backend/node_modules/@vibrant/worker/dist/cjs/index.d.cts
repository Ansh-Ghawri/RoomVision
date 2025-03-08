import { WorkerPool } from './pool.cjs';
import { TaskWorkerClass } from './common.cjs';
export declare class WorkerManager {
    private _pools;
    register(name: string, WorkerClass: TaskWorkerClass): void;
    hasWorker(name: string): boolean;
    getWorker(name: string): WorkerPool | undefined;
    invokeWorker<R>(name: string, args: any[], transferList?: any[]): Promise<R>;
}
export * from './worker.cjs';
export * from './common.cjs';
