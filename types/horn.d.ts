import DragCanvas, { HornProps, RectProps, imageProps } from './canvas';
declare class Horn {
    x: number;
    y: number;
    width: number;
    height: number;
    Canvas: DragCanvas;
    direction: string;
    cursor: string;
    containterX: number;
    containterY: number;
    radian: number;
    cancel?: boolean;
    color: string | CanvasGradient;
    x2?: number;
    y2?: number;
    constructor({ x, y, width, height, Canvas, direction, cursor, containterY, containterX, radian, color, cancel, x2, y2, }: HornProps);
    directionShape(list: RectProps[] | imageProps[], movex: number, movey: number): void;
    paint(): void;
    mousedown(e: MouseEvent): void;
}
export default Horn;
