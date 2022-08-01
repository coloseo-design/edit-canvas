import Line from './line';
import ImageRect from './image';
import Rect from './rect';
import CanvsText from './text';
export interface BaseRectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    Canvas?: DragCanvas;
    radian?: number;
    uuid?: string;
}
export interface imageProps extends BaseRectProps {
    filter?: string;
    degree?: number;
    src: string;
}
export interface RectProps extends BaseRectProps {
    color: string;
}
export interface BaseHornProps {
    x: number;
    y: number;
    width: number;
    height: number;
    radian: number;
}
export interface HornProps extends BaseHornProps {
    direction: string;
    cursor: string;
    containterX: number;
    containterY: number;
    cancel: boolean;
    color: string;
    x2?: number;
    y2?: number;
    Canvas: DragCanvas;
}
declare class DragCanvas {
    canvas: HTMLCanvasElement;
    editCtx: CanvasRenderingContext2D;
    rectList: Rect[];
    imageList: ImageRect[];
    hornList: HornProps[];
    lineList: Line[];
    textList: CanvsText[];
    hornW: number;
    protected currentShape: any;
    currentContainter: any;
    backOperation: any;
    paintColor: string;
    lineWidth: number;
    isWrite: boolean;
    ratio: number;
    constructor(canvas: HTMLCanvasElement);
    get width(): number;
    get height(): number;
    init(): void;
    add(options: ImageRect | Rect | Line | CanvsText): void;
    remove(options: ImageRect | Rect | Line | CanvsText): void;
    clear(): void;
    back(step?: number): void;
    paintHorn(option: BaseHornProps, cancel?: boolean): void;
    paintAll(option: BaseHornProps, cancel?: boolean): void;
    Operations(downinfo: any, containter: any, ishorn: boolean): void;
    mouseJudge(e: MouseEvent, type: 'down' | 'move'): any;
    onmousedown(e: MouseEvent): void;
    mousemove(e: MouseEvent): void;
}
export declare type DragCanvasType = DragCanvas;
export default DragCanvas;
