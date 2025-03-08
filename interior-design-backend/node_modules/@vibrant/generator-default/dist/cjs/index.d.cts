import { Generator } from '@vibrant/generator';
export interface GeneratorOptions {
    targetDarkLuma: number;
    maxDarkLuma: number;
    minLightLuma: number;
    targetLightLuma: number;
    minNormalLuma: number;
    targetNormalLuma: number;
    maxNormalLuma: number;
    targetMutesSaturation: number;
    maxMutesSaturation: number;
    targetVibrantSaturation: number;
    minVibrantSaturation: number;
    weightSaturation: number;
    weightLuma: number;
    weightPopulation: number;
}
export declare const DefaultOpts: GeneratorOptions;
export declare const DefaultGenerator: Generator;
