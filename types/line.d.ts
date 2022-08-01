import DragCanvas from './canvas';
export interface LineProps {
    Canvas?: DragCanvas;
    color?: string;
    lineWidth?: number;
    uuid?: string;
}
declare class Line {
    Canvas?: DragCanvas;
    color?: string;
    lineWidth?: number;
    uuid?: string;
    line?: Path2D | null;
    constructor({ Canvas, color, lineWidth, uuid }: LineProps);
    paint(): void;
    delete(): void;
    paintBrush(): void;
    mousedown(e: MouseEvent): void;
}
export default Line;
