import { ImageBase, ImageData, ImageSource } from '@vibrant/image';
export declare class NodeImage extends ImageBase {
    private _image;
    private _getImage;
    private _loadByProtocolHandler;
    private _loadFromPath;
    private _loadByJimp;
    load(image: ImageSource): Promise<ImageBase>;
    clear(): void;
    update(_imageData: ImageData): void;
    getWidth(): number;
    getHeight(): number;
    resize(targetWidth: number, targetHeight: number, _ratio: number): void;
    getPixelCount(): number;
    getImageData(): ImageData;
    remove(): void;
}
