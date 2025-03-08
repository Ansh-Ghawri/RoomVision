import { Vec3 } from './';
export declare const DELTAE94_DIFF_STATUS: {
    NA: number;
    PERFECT: number;
    CLOSE: number;
    GOOD: number;
    SIMILAR: number;
};
/**
 * Converts hex string to RGB
 * @param hex - The hex value you with to get the RGB value of
 * @returns an array in the order of `red, green, blue` numerical values
 */
export declare function hexToRgb(hex: string): Vec3;
/**
 * Given values for an RGB color convert to and return a valid HEX string
 * @param r - Red value in RGB
 * @param g - Green value in RGB
 * @param b - Blue value in RGB
 * @returns a valid hex string with pre-pending pound sign
 */
export declare function rgbToHex(r: number, g: number, b: number): string;
/**
 * Given values for an RGB color convert to and return a valid HSL value
 * @param r - Red value in RGB
 * @param g - Green value in RGB
 * @param b - Blue value in RGB
 * @returns an array in the order of `hue, saturation, light` numerical values
 */
export declare function rgbToHsl(r: number, g: number, b: number): Vec3;
export declare function hslToRgb(h: number, s: number, l: number): Vec3;
export declare function rgbToXyz(r: number, g: number, b: number): Vec3;
export declare function xyzToCIELab(x: number, y: number, z: number): Vec3;
export declare function rgbToCIELab(r: number, g: number, b: number): Vec3;
/**
 * Computes CIE delta E 1994 diff between `lab1` and `lab2`. The 2 colors are in CIE-Lab color space. Used in tests to compare 2 colors' perceptual similarity.
 */
export declare function deltaE94(lab1: Vec3, lab2: Vec3): number;
/**
 * Compute CIE delta E 1994 diff between `rgb1` and `rgb2`.
 */
export declare function rgbDiff(rgb1: Vec3, rgb2: Vec3): number;
/**
 * Compute CIE delta E 1994 diff between `hex1` and `hex2`.
 */
export declare function hexDiff(hex1: string, hex2: string): number;
/**
 * Gets a string to describe the meaning of the color diff. Used in tests.
 *
 * Delta E  | Perception                             | Returns
 * -------- | -------------------------------------- | -----------
 * <= 1.0   | Not perceptible by human eyes.         | `"Perfect"`
 * 1 - 2    | Perceptible through close observation. | `"Close"`
 * 2 - 10   | Perceptible at a glance.               | `"Good"`
 * 11 - 49  | Colors are more similar than opposite  | `"Similar"`
 * 50 - 100 | Colors are exact opposite              | `Wrong`
 */
export declare function getColorDiffStatus(d: number): string;
