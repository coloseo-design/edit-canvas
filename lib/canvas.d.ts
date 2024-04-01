import { Application } from "pixi.js";
export type positionType = {
    x: number;
    y: number;
};
declare class Canvas {
    app: Application | null;
    private mainContainer;
    private root;
    private isDown;
    private rod;
    private temStartX;
    private temStartY;
    private selected;
    private GraffitiContainer;
    isGraffiti: boolean;
    private GraffitiList;
    private cacheGraffitiList;
    showScale: boolean;
    private setIndex;
    private pointerDown;
    private appOperate;
    private rootOperate;
    clearCanvas: () => void;
    deleteGraffiti(): void;
    revokeGraffiti(): void;
    getSelectedGraphics(): any;
    add(ele: any): void;
    startGraffiti(): void;
    endGraffiti(): void;
    private getBrushParent;
    getImage(ele: any): Promise<{
        mainSrc: any;
        graffitiSrc: string;
        cropSrc: string;
    }>;
    setScale(show: boolean): void;
    changeBgColor(color: number): void;
    attach(root: HTMLElement): void;
    detach(root: HTMLElement): void;
}
export default Canvas;
