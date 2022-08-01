import DragCanvas, { imageProps } from './canvas';
declare class ImageRect {
    width: number;
    height: number;
    x: number;
    y: number;
    Canvas?: DragCanvas;
    src: string;
    img?: HTMLImageElement;
    radian?: number;
    uuid?: string;
    filter?: string;
    degree?: number;
    offsetScreenCanvas?: HTMLCanvasElement;
    offsetScreenCtx?: CanvasRenderingContext2D | null;
    constructor({ width, height, x, y, Canvas, radian, uuid, filter, degree, src }: imageProps);
    paint(): void;
    delete(): void;
    filters(f: string, degree?: number): void;
    paintImage(): void;
    mousedown(e: MouseEvent): void;
}
export default ImageRect;
