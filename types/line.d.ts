import DragCanvas from './canvas';
export interface LineProps {
    Canvas: DragCanvas;
    paintColor: string;
}
declare class Line {
    Canvas: DragCanvas;
    paintColor: string;
    constructor({ Canvas, paintColor }: LineProps);
    mousedown(e: MouseEvent): void;
}
export default Line;
