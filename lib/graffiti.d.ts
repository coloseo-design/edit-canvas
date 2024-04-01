import { InteractionEvent } from 'pixi.js';
import { positionType } from './canvas';
type GraffitiType = {
    color?: number;
    lineWidth?: number;
    alpha?: number;
};
declare class Graffiti {
    brush: any;
    color: number;
    lineWidth: number;
    children: Graffiti[];
    uuid: string;
    app: any;
    operate: any;
    container: any;
    alpha: number;
    constructor(props?: GraffitiType);
    paint: (e: InteractionEvent) => void;
    setStyle({ color, alpha, lineWidth }: GraffitiType): void;
    delete: () => void;
    private repeat;
    down: (e: InteractionEvent) => void;
    move: (start: positionType) => void;
    up: () => void;
}
export default Graffiti;
