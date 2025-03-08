import { TaskWorkerClass } from '@vibrant/worker';
import { Pipeline, ProcessOptions, ProcessResult } from '../index.js';
/**
 * @private
 * Client side (runs in UI thread)
 */
export declare class WorkerPipeline implements Pipeline {
    protected PipelineWorker: TaskWorkerClass;
    private _manager;
    constructor(PipelineWorker: TaskWorkerClass);
    private _rehydrate;
    process(imageData: ImageData, opts: ProcessOptions): Promise<ProcessResult>;
}
