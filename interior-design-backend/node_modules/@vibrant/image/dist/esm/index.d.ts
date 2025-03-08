import { Filter } from '@vibrant/color';
export { Histogram } from './histogram.js';
export type { HistogramOptions } from './histogram.js';
/**
 * HTMLImageElement - browser only
 * Buffer - Node.js only
 */
export type ImageSource = string | HTMLImageElement | Buffer;
export type Pixels = Uint8ClampedArray | Buffer;
export interface ImageData {
    data: Pixels;
    width: number;
    height: number;
}
export interface ImageOptions {
    /**
     * Scale down factor used in downsampling stage. 1 means no downsampling. If `maxDimension` is set, this value will not be used.
     * @default 5
     */
    quality: number;
    /**
     * The max size of the image's longer side used in downsampling stage. This field will override `quality`.
     * @default undefined
     */
    maxDimension: number;
}
export interface Image {
    load(image: ImageSource): Promise<Image>;
    clear(): void;
    update(imageData: ImageData): void;
    getWidth(): number;
    getHeight(): number;
    resize(targetWidth: number, targetHeight: number, ratio: number): void;
    getPixelCount(): number;
    getImageData(): ImageData;
    remove(): void;
    scaleDown(opts: ImageOptions): void;
}
export interface ImageClass {
    new (): Image;
}
export declare abstract class ImageBase implements Image {
    abstract load(image: ImageSource): Promise<ImageBase>;
    abstract clear(): void;
    abstract update(imageData: ImageData): void;
    abstract getWidth(): number;
    abstract getHeight(): number;
    abstract resize(targetWidth: number, targetHeight: number, ratio: number): void;
    abstract getPixelCount(): number;
    abstract getImageData(): ImageData;
    abstract remove(): void;
    scaleDown(opts: ImageOptions): void;
}
/**
 * @private
 */
export declare function applyFilters(imageData: ImageData, filters: Filter[]): ImageData;
