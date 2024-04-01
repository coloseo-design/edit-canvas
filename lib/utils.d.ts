import { InteractionEvent, Container } from 'pixi.js';
export declare const getPoint: (e: InteractionEvent) => {
    x: number;
    y: number;
};
export declare const uuid: () => string;
export declare const getBoundRect: (ele: any) => {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare const overflowContainer: (ele: any, parent: any) => boolean;
export declare const loopChild: (data?: any[], editInfo?: {
    x: number;
    y: number;
} | null) => void;
export type positionType = {
    x: number;
    y: number;
};
export declare const exportImage: (main: any, graffitiL: any[], mainContainer: Container, GraffitiContainer: Container) => Promise<{
    mainSrc: any;
    graffitiSrc: string;
    cropSrc: string;
}>;
