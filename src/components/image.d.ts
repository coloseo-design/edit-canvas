import { InteractionEvent } from 'pixi.js';
type positionType = {
    x: number;
    y: number;
};
declare class EditImage {
    url: string;
    position: positionType;
    sprite: any;
    container: any;
    width: number;
    height: number;
    operate: any;
    text: any;
    app: any;
    constructor({ url, position, container, width, height, operate, text }: any);
    delete: () => void;
    paint: () => void;
    change: ({ x, y, w, h }: any) => void;
    changePosition: ({ x, y, width, height }: positionType & {
        width: number;
        height: number;
    }) => void;
    down: (e: InteractionEvent) => void;
    move(start: positionType): void;
    up: () => void;
}
export default EditImage;
