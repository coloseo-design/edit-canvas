import { InteractionEvent, TextStyle } from 'pixi.js';
import { positionType } from './canvas';
declare class EditText {
    value: string;
    position: positionType;
    style: any | TextStyle;
    text: any;
    container: any;
    operate: any;
    width: number;
    height: number;
    uuid: string;
    private parent;
    private rootContainer;
    private input;
    rootDom: HTMLElement | null;
    private isPinyin;
    private isFocus;
    app: any;
    constructor({ width, height, value, style, position, container, rootContainer, operate }: any);
    paint: () => void;
    createInput(): void;
    oninput: (e: any) => void;
    writeText: (value?: string) => void;
    onfocus: () => void;
    onblur: () => void;
    oncompositionstart: () => void;
    oncompositionend: (e: any) => void;
    parentData: () => void;
    changePosition: ({ x, y, width, height }: positionType & {
        width: number;
        height: number;
    }) => void;
    delete: () => void;
    down: (e: InteractionEvent) => void;
    move(start: positionType): void;
    up: (e: InteractionEvent) => void;
}
export default EditText;
