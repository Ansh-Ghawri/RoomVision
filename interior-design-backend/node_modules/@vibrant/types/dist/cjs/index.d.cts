export type Resolvable<T> = T | Promise<T>;
/**
 * An internal implementation of Promise.withResolvers
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
 */
export declare class Defer<R> {
    resolve: (thenableOrResult: R | Promise<R>) => void;
    reject: (error: any) => void;
    promise: Promise<R>;
    constructor();
}
/**
 * An internal implementation of Promise.withResolvers
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
 */
export declare function defer<R>(): Defer<R>;
