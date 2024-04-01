interface CanvasState {
    pixelRatio: number;
    container: {
        width: number;
        height: number;
    };
    camera: {
        x: number;
        y: number;
        z: number;
    };
    pointer: {
        x: number;
        y: number;
    };
}
export declare const getInitialCanvasState: () => CanvasState;
export declare const CAMERA_ANGLE: number;
export declare const RECT_W = 500;
export declare const RECT_H = 500;
export declare const cameraToScreenCoordinates: (x: number, y: number, z: number, cameraAngle: number, screenAspect: number) => {
    x: number;
    y: number;
    width: number;
    height: number;
};
export default class CanvasStore {
    private static get data();
    static initialize(width: number, height: number): void;
    static get container(): any;
    static get aspect(): number;
    static get screen(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    static get camera(): any;
    static get pointer(): any;
    static get scale(): {
        x: number;
        y: number;
    };
    static moveCamera(mx: number, my: number): void;
    static movePointer(deltaX: number, deltaY: number): void;
    static zoomCamera(deltaX: number, deltaY: number): void;
}
export {};
