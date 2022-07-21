import DragCanvas, { imageProps } from './canvas';
declare class ImageRect {
    width: number;
    height: number;
    x: number;
    y: number;
    Canvas?: DragCanvas;
    img: HTMLImageElement;
    radian?: number;
    uuid?: string;
    filter?: string;
    degree?: number;
    constructor({ width, height, x, y, Canvas, img, radian, uuid, filter, degree }: imageProps);
    paintFilter(fn: Function): void;
    VagueMosaic(type: string): void;
    mousedown(e: MouseEvent): void;
}
export default ImageRect;
