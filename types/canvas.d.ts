import ImageRect from './image';
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
    img: HTMLImageElement;
    filter?: string;
    degree?: number;
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
    rectList: RectProps[];
    imageList: ImageRect[];
    hornList: HornProps[];
    lineList: any;
    hornW: number;
    protected currentShape: any;
    currentContainter: any;
    backOperation: any;
    paintStart: boolean;
    paintColor: string;
    constructor(canvas: HTMLCanvasElement);
    get width(): number;
    get height(): number;
    init(): void;
    createRect(option: RectProps): void;
    createImage(option: imageProps): void;
    paintHorn(option: BaseHornProps, cancel?: boolean): void;
    filter(type: string, degree?: number): void;
    back(step?: number): void;
    paintBrush(color?: string): void;
    ImageRotate(ele: ImageRect): void;
    paintImage(first?: boolean): void;
    paintRect(): void;
    repaintLine(): void;
    paintAll(option: BaseHornProps, cancel?: boolean): void;
    Operations(downinfo: any, containter: any, ishorn: boolean): void;
    mouseJudge(e: MouseEvent, type: 'down' | 'move'): any;
    onmousedown(e: MouseEvent): void;
    mousemove(e: MouseEvent): void;
}
export declare type DragCanvasType = DragCanvas;
export default DragCanvas;
