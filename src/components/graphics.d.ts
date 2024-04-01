import { InteractionEvent, Container } from 'pixi.js';
import { lineStyle } from './operate';
import { positionType } from './canvas';
declare class EditGraphics {
    width: number;
    height: number;
    position: any;
    graphics: any;
    container: any;
    shape: any;
    radius: number;
    lineStyle: lineStyle;
    background: number;
    rootContainer: Container;
    private parent;
    app: any;
    private uuid;
    name: string;
    operate: any;
    alpha: number;
    isEdit: boolean;
    constructor({ width, height, position, container, shape, radius, lineStyle, background, rootContainer, operate, name, isEdit, alpha, }: any);
    parentData: () => void;
    delete: () => void;
    paint(): void;
    changePosition: ({ x, y, width, height }: positionType & {
        width?: number | undefined;
        height?: number | undefined;
    }) => void;
    repeat: () => void;
    down: (e: InteractionEvent) => void;
    move(start: positionType): void;
    up: (e: InteractionEvent) => void;
}
export default EditGraphics;
