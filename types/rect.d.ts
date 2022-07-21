import DragCanvas, { RectProps } from './canvas';
declare class Rect {
    width: number;
    height: number;
    x: number;
    y: number;
    color: string;
    Canvas?: DragCanvas;
    radian?: number;
    uuid?: string;
    constructor({ width, height, x, y, color, Canvas, radian, uuid }: RectProps);
    mousedown(e: MouseEvent): void;
}
export default Rect;
