import { Resolvable } from '@vibrant/types';
export declare function runInWorker<R>(self: Window, fn: (...args: any[]) => Resolvable<R>): void;
