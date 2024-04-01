interface CanvasState {
  pixelRatio: number; // our resolution for dip calculations
  container: {   //holds information related to our screen container
    width: number;
    height: number;
  };
  camera: {  //holds camera state
    x: number;
    y: number;
    z: number;
  };
  pointer: {
    x: number;
    y: number;
  };
}
export const getInitialCanvasState = (): CanvasState => {
  return {
    pixelRatio: window.devicePixelRatio || 1,
    container: {
      width: 0,
      height: 0,
    },
    camera: {
      x: 0,
      y: 0,
      z: 0,
    },
    pointer: {
      x: 0,
      y: 0,
    }
  };
};
const radians = (angle: number) => {
  return angle * (Math.PI / 180);
};

let canvasData: any = null;
export const CAMERA_ANGLE = radians(30);
export const RECT_W = 500;
export const RECT_H = 500;

export const cameraToScreenCoordinates = (
  x: number,
  y: number,
  z: number,
  cameraAngle: number,
  screenAspect: number
) => {
  const width = 2 * z * Math.tan(CAMERA_ANGLE);
  const height = width / screenAspect;
  const screenX = x - width / 2;
  const screenY = y - height / 2;
  return { x: screenX, y: screenY, width, height };
};

const scaleWithAnchorPoint = (
  anchorPointX: number,
  anchorPointY: number,
  cameraX1: number,
  cameraY1: number,
  scaleX1: number,
  scaleY1: number,
  scaleX2: number,
  scaleY2: number
) => {
  const cameraX2 =
    (anchorPointX * (scaleX2 - scaleX1) + scaleX1 * cameraX1) / scaleX2;
  const cameraY2 =
    (anchorPointY * (scaleY2 - scaleY1) + scaleY1 * cameraY1) / scaleY2;
  return { x: cameraX2, y: cameraY2 };
};

export default class CanvasStore {
  private static get data() {
    if (!canvasData) canvasData = {
      pixelRatio: window.devicePixelRatio || 1,
      pixelsPerFrame: 1,
      container: {
        width: 0,
        height: 0,
      },
      pointer: {
        x: 0,
        y: 0,
      },
      canvas: {
        width: 0,
        height: 0,
      },
      camera: {
        x: 0,
        y: 0,
        z: 0,
      },
    };
    return canvasData;
  }

  static initialize(width: number, height: number) {
    const containerWidth = width;
    const containerHeight = height;
    canvasData = getInitialCanvasState();
    canvasData.pixelRatio = window.devicePixelRatio || 1;
    canvasData.container.width = containerWidth;
    canvasData.container.height = containerHeight;
    canvasData.camera.y = height / 2;
    canvasData.camera.x = width / 2;
    canvasData.camera.z = containerWidth / (2 * Math.tan(CAMERA_ANGLE));
  }
  public static get container() {
    return this.data.container;
  }
  public static get aspect() {
    const { width, height } = this.container;
    return width / height;
  }
  public static get screen() {
    const { x, y, z } = this.camera;
    const { width, height } = CanvasStore.container;
    const aspect = width / height;
    const angle = radians(30);
    return cameraToScreenCoordinates(x, y, z, angle, aspect);
  }
  public static get camera() {
    return this.data.camera;
  }
  public static get pointer() {
    return this.data.pointer;
  }

  public static get scale() {
    const { width: w, height: h } = CanvasStore.screen;
    const { width: cw, height: ch } = CanvasStore.container;
    return { x: cw / w, y: ch / h };
  }
  public static moveCamera(mx: number, my: number) {
    const scrollFactor = 1.5;
    const deltaX = mx * scrollFactor;
    const deltaY = my * scrollFactor;
    const { x, y, z } = this.camera;
    this.data.camera.x += deltaX;
    this.data.camera.y += deltaY;
    // move pointer by the same amount
    this.movePointer(deltaY, deltaY);
  }
  public static movePointer(deltaX: number, deltaY: number) {
    const scale = this.scale;
    const { x: left, y: top } = this.screen;
    this.data.pointer.x = left + deltaX / scale.x;
    this.data.pointer.y = top + deltaY / scale.y;
  }

  public static zoomCamera(deltaX: number, deltaY: number) {
    const zoomScaleFactor = 10;
    const deltaAmount = zoomScaleFactor * Math.max(deltaY);
    const { x: oldX, y: oldY, z: oldZ } = this.camera;
    const oldScale = { ...this.scale };
    const z = deltaY <0 ? Math.abs(oldZ + deltaAmount) : oldZ + deltaAmount;
    const { width: containerWidth, height: containerHeight } = this.container;
    const { width, height } = cameraToScreenCoordinates(
      oldX,
      oldY,
      z,
      // oldZ + deltaAmount,
      CAMERA_ANGLE,
      this.aspect
    );

    const newScaleX = containerWidth / width;
    const newScaleY = containerHeight / height;
    const { x: newX, y: newY } = scaleWithAnchorPoint(
      this.pointer.x,
      this.pointer.y,
      oldX,
      oldY,
      oldScale.x,
      oldScale.y,
      newScaleX,
      newScaleY
    );
    // const newZ = oldZ + deltaAmount;
    const newZ = z;
    this.data.camera = {
      x: newX,
      y: newY,
      z: newZ,
    };
  }
}