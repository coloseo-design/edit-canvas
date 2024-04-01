import { Graphics, Text } from 'pixi.js';
declare class ScaleLine {
    topContainer: any;
    topContainer1: any;
    leftContainer: any;
    boundary: number;
    gap: number;
    countX: number;
    countY: number;
    private scrollList;
    swipeList: any[];
    verticalSwipes: any[];
    private verticalScroll;
    constructor({ gap }: any);
    paintContainer(x: number, y: number, width: number, height: number): Graphics;
    paint(start: number, isVertical?: boolean, gap?: number): void;
    paintX(start?: number, gap?: number): void;
    paintY(start?: number, gap?: number): void;
    write(distance: number, temList: any, uid: string, list?: any, isVertical?: boolean): void;
    line(move: any, end: any): Graphics;
    text(txt: string, x: number, y: number, isVertical: boolean): Text;
}
export default ScaleLine;
