interface BaseRectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    Canvas?: DragCanvas;
    radian?: number;
}
interface imageProps extends BaseRectProps {
    img: HTMLImageElement;
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
    protected imageInfo: {};
    protected currentShape: any;
    currentContainter: any;
    constructor(canvas: HTMLCanvasElement);
    get width(): number;
    get height(): number;
    isPosInRotationRect(point: any, shape: any, hornRadinCenter?: any): boolean;
    init(): void;
    createRect(option: RectProps): void;
    createImage(option: imageProps): void;
    paintHorn(option: BaseHornProps, cancel?: boolean): void;
    ImageRotate(ele: imageProps): void;
    paintImage(first?: boolean): void;
    paintRect(): void;
    onmousedown(e: MouseEvent): void;
    mousemove(e: MouseEvent): void;
}
export default DragCanvas;
