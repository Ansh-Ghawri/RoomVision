import { Pixels } from '@vibrant/image';
import { Resolvable } from '@vibrant/types';
import { Swatch } from '@vibrant/color';
export interface QuantizerOptions {
    /**
     * Amount of colors in initial palette from which the swatches will be generated
     * @default 64
     */
    colorCount: number;
}
export interface Quantizer {
    (pixels: Pixels, opts: QuantizerOptions): Resolvable<Array<Swatch>>;
}
