import { Vibrant } from './';
import { ImageClass, ImageSource } from '@vibrant/image';
import { Palette } from '@vibrant/color';
import { Options } from './options.js';
/**
 * Helper class for change configurations and create a Vibrant instance. Methods of a Builder instance can be chained like:
 *
 * @example
 * ```javascript
 * Vibrant.from(src)
 *   .quality(1)
 *   .clearFilters()
 *   // ...
 *   .getPalette()
 *   .then((palette) => {})
 * ```
 */
export declare class Builder {
    private _src;
    private _opts;
    /**
     * Arguments are the same as `Vibrant.constructor`.
     */
    constructor(src: ImageSource, opts?: Partial<Options>);
    /**
     * Sets `opts.colorCount` to `n`.
     * @returns this `Builder` instance.
     */
    maxColorCount(n: number): Builder;
    /**
     * Sets `opts.maxDimension` to `d`.
     * @returns this `Builder` instance.
     */
    maxDimension(d: number): Builder;
    /**
     * Adds a filter function
     * @returns this `Builder` instance.
     */
    addFilter(name: string): Builder;
    /**
     * Removes a filter function.
     * @returns this `Builder` instance.
     */
    removeFilter(name: string): Builder;
    /**
     * Clear all filters.
     * @returns this `Builder` instance.
     */
    clearFilters(): Builder;
    /**
     * Sets `opts.quality` to `q`.
     * @returns this `Builder` instance.
     */
    quality(q: number): Builder;
    /**
     * Specifies which `Image` implementation class to use.
     * @returns this `Builder` instance.
     */
    useImageClass(imageClass: ImageClass): Builder;
    /**
     * Sets `opts.generator` to `generator`
     * @returns this `Builder` instance.
     */
    useGenerator(generator: string, options?: any): Builder;
    /**
     * Specifies which `Quantizer` implementation class to use
     * @returns this `Builder` instance.
     */
    useQuantizer(quantizer: string, options?: any): Builder;
    /**
     * Builds and returns a `Vibrant` instance as configured.
     */
    build(): Vibrant;
    /**
     * Builds a `Vibrant` instance as configured and calls its `getPalette` method.
     */
    getPalette(): Promise<Palette>;
}
