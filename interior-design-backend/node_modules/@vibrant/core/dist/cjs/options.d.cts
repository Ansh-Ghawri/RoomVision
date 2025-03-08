import { ProcessOptions, StageOptions } from './pipeline.cjs';
import { QuantizerOptions } from '@vibrant/quantizer';
import { ImageClass, ImageOptions } from '@vibrant/image';
export interface Options extends ImageOptions, QuantizerOptions {
    useWorker: boolean;
    /**
     * An `Image` implementation class
     * @default `Image.Node` or `Image.Browser`
     */
    ImageClass: ImageClass;
    quantizer: string | StageOptions;
    generators: (string | StageOptions)[];
    /**
     * An array of filters
     * @default []
     */
    filters: string[];
}
/**
 * @private
 */
export declare function buildProcessOptions(opts: Options, override?: Partial<ProcessOptions>): ProcessOptions;
