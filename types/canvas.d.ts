interface BaseRectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    Canvas?: DragCanvas;
    radian?: number;
    uuid?: string;
}
interface imageProps extends BaseRectProps {
    img: HTMLImageElement;
    filter?: string;
}
interface RectProps extends BaseRectProps {
    color: string;
}
interface BaseHornProps {
    x: number;
    y: number;
    width: number;
    height: number;
    radian: number;
}
interface HornProps extends BaseHornProps {
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
    imageList: imageProps[];
    hornList: HornProps[];
    hornW: number;
    protected currentShape: any;
    currentContainter: any;
    backOperation: any;
    constructor(canvas: HTMLCanvasElement);
    get width(): number;
    get height(): number;
    isPosInRotationRect(point: any, shape: any, hornRadinCenter?: any): boolean;
    init(): void;
    createRect(option: RectProps): void;
    createImage(option: imageProps): void;
    paintHorn(option: BaseHornProps, cancel?: boolean): void;
    back(step?: number): void;
    FilterChange(ele: imageProps, fn: Function): void;
    filter(type: string): void;
    ImageRotate(ele: imageProps): void;
    paintImage(first?: boolean): void;
    paintRect(): void;
    Operations(downinfo: any, containter: any, ishorn: boolean): void;
    onmousedown(e: MouseEvent): void;
    mousemove(e: MouseEvent): void;
}
export declare type DragCanvasType = DragCanvas;
export default DragCanvas;
