import { Pixels } from './index.js';
export interface HistogramOptions {
    sigBits: number;
}
export declare class Histogram {
    pixels: Pixels;
    opts: HistogramOptions;
    bmin: number;
    bmax: number;
    gmin: number;
    gmax: number;
    rmin: number;
    rmax: number;
    hist: Uint32Array;
    private _colorCount;
    get colorCount(): number;
    getColorIndex: (r: number, g: number, b: number) => number;
    constructor(pixels: Pixels, opts: HistogramOptions);
}
