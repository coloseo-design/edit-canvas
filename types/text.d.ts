import DragCanvas from './canvas';
export interface TextProps {
    x?: number;
    y?: number;
    font?: string;
    Canvas?: DragCanvas;
    value?: string;
    width?: number;
    height?: number;
    uuid?: string;
    color?: string;
    radian?: number;
    input?: HTMLInputElement | null;
}
declare class CanvsText {
    x: number;
    y: number;
    font: string;
    Canvas?: DragCanvas;
    isChinaStart: boolean;
    value: string;
    notChainese: string;
    input?: HTMLInputElement | null;
    width: number;
    height: number;
    uuid?: string;
    color?: string;
    cursorColor?: string;
    isAddText?: boolean;
    constructor({ x, y, font, Canvas, uuid, color, value }: TextProps);
    setInputAttribute(x: number, y: number): void;
    createText(): void;
    paint(): void;
    delete(): void;
    writeText(): void;
    oncompositionstart(): void;
    oncompositionend(): void;
    changePaint(): void;
    oninput(e: any): void;
    onblur(): void;
    onfoucs(): void;
    mousedown(e: MouseEvent): void;
}
export default CanvsText;
