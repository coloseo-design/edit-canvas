import { Graphics, InteractionEvent } from 'pixi.js';
type positionType = {
    x: number;
    y: number;
};
export type lineStyle = {
    width?: number;
    color?: number;
    alpha?: number;
    alignment?: number;
    native?: boolean;
};
type argType = {
    w: number;
    h: number;
} & positionType;
declare class OperateRect {
    lineStyle: lineStyle;
    position: positionType;
    width: number;
    height: number;
    leftTop: Graphics;
    leftBottom: Graphics;
    rightTop: Graphics;
    rightBottom: Graphics;
    operateContainer: Graphics;
    main: Graphics;
    isDrag: boolean;
    startPosition: positionType;
    dirMap: any;
    operateGraphical: any;
    moveType: string;
    x: number;
    y: number;
    originX: number;
    originY: number;
    originW: number;
    originH: number;
    root: HTMLElement | null;
    constructor({ lineStyle, position, }: any);
    clear: () => void;
    paintRect: ({ x, y, w, h }: argType, init?: boolean) => void;
    paint: ({ x, y, width, height }: any, isSelf?: boolean, init?: boolean) => void;
    hornDown: (type: string, e: InteractionEvent) => void;
    getCursor: (type: string) => string;
    hornMove: (type: string) => void;
    diffMove: (type: string, e: InteractionEvent) => void;
    hornUp: () => void;
}
export default OperateRect;
