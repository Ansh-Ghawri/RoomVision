import { ImageBase, ImageSource, ImageData as VibrantImageData } from '@vibrant/image';
export declare class BrowserImage extends ImageBase {
    image: HTMLImageElement | undefined;
    private _canvas;
    private _context;
    private _width;
    private _height;
    private _getCanvas;
    private _getContext;
    private _getWidth;
    private _getHeight;
    private _initCanvas;
    load(image: ImageSource): Promise<this>;
    clear(): void;
    update(imageData: VibrantImageData): void;
    getWidth(): number;
    getHeight(): number;
    resize(targetWidth: number, targetHeight: number, ratio: number): void;
    getPixelCount(): number;
    getImageData(): ImageData;
    remove(): void;
}
