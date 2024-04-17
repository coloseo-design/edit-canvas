import { InteractionEvent, Graphics, Sprite, Application, Container } from 'pixi.js';
import EditText from './text';
import EditGraphics from './graphics';
import EditImage from './image';
import EditGraffiti from './graffiti';
import CanvasStore from './store';
import Layer from './layer';


export type positionType = { x: number; y: number };

export type boundRectType = positionType & { width: number, height: number };

export type eleType = EditGraffiti | EditText | EditImage | EditGraphics | Layer;

export const wheelListener = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  const friction = 1;
  const event = e as WheelEvent;
  const deltaX = event.deltaX * friction;
  const deltaY = event.deltaY * friction;
  if (!event.ctrlKey) { // 滚轮移动
    CanvasStore.moveCamera(deltaX, deltaY);
  } else { // 缩放
    CanvasStore.zoomCamera(deltaX, deltaY);
  }
};

export const pointerListener = (event: PointerEvent) => {
  CanvasStore.movePointer(event.offsetX, event.offsetY);
};


export const getPoint = (e: InteractionEvent) => {
  return {
    x: e.data.global.x,
    y: e.data.global.y,
  }
};

export const uuid = (): string => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};

export const getScalePoint = (e: InteractionEvent) => {
  const { x: screenX, y: screenY } = CanvasStore.screen;
  const { x: scaleX, y: scaleY } = CanvasStore.scale;
  const scalePosition = getPoint(e);
  const moveX = screenX * scaleX;
  const moveY = screenY * scaleY;
  const originX = (scalePosition.x + moveX) / scaleX;
  const originY = (scalePosition.y + moveY) / scaleY;
  return {
    x: originX,
    y: originY,
  }
}

export const getBoundRect = (ele: any) => {
  if (ele) {
    const { x, y, width, height } = ele.getBounds();
    const { x: screenX, y: screenY } = CanvasStore.screen;
    const { x: scaleX, y: scaleY } = CanvasStore.scale;
    const moveX = screenX * scaleX;
    const moveY = screenY * scaleY;
    const originX = (x + moveX) / scaleX;
    const originY = (y + moveY) / scaleY;
    const originW = width / scaleX;
    const originH = height / scaleY;
    return {
      x: originX,
      y: originY,
      width: Number(originW.toFixed(2)),
      height: Number(originH.toFixed(2)),
    }
  }
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
}

export const overflowContainer = (ele: any, parent: any) => {
  const { x, y, width: w, height: h, } = getBoundRect(ele);
  const { x: x1, y: y1, width: w1, height: h1, } = parent;
  // 判断 ele 是否在parent 里面
  let ax = false;
  let ay = false;
  if ((x > 0 && x >= x1 && x + w <= x1 + w1) || (x < 0 && x <= x1 && Math.abs(x) + w <= Math.abs(x1) + w1)) {
    ax = true
  }
  if ((y > 0 && y >= y1 && y + h <= y1 + h1) || (y < 0 && y <= y1 && Math.abs(y) + h <= Math.abs(y1) + h1)) {
    ay = true;
  }
  return (!ax || !ay) ? true : false
}


const sleep = (num: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(null), num);
  });



export const getPixiGra = (ele: eleType) => {
  if (ele instanceof EditGraffiti) {
    return 'brush';
  } else if (ele instanceof EditGraphics) {
    return 'graphics';
  } else if (ele instanceof EditImage) {
    return 'sprite';
  } else if (ele instanceof EditText) {
    return 'text';
  } else if (ele instanceof Layer) {
    return 'layer';
  } else {
    throw new Error('传参不对');
  };
}

export const getImage = (main: eleType | Container) => {
  const rect = main instanceof Container ? main :  (main as any)[getPixiGra(main)] || '';
  if (rect) {
    const { width, height } = getBoundRect(rect);
    const imageApp = new Application({
      width,
      height,
      resolution: 12,
      antialias: true, // 抗锯齿
      autoDensity: true,
      transparent: true,
    });
    const imageContainer = new Container();
    imageContainer.addChild(rect);
    imageApp.stage.addChild(imageContainer);
    const mainSrc = imageApp.renderer.plugins.extract.base64(imageContainer);
    const img = imageApp.renderer.plugins.extract.image(imageContainer, "image/png", 1);
    return {
      base64: mainSrc,
      img,
    }
  }
  return {
    base64: '',
    img: '',
  };
}

export const getBoxImage = async (container: eleType, main: eleType | Container) => {
  const { img } = getImage(main);
  const rect = (container as any)[getPixiGra(container)] || '';
  await sleep(100);
  const { x, y, width, height } = getBoundRect(rect);
  const temp = main instanceof Container ? main : (main as any)[getPixiGra(main)];
  const { x: bx, y: by } = getBoundRect(temp);
  const tx = x - bx;
  const ty = y - by;
  const canvasElement: HTMLCanvasElement = document.createElement('canvas');
  const ctx: CanvasRenderingContext2D | null = canvasElement.getContext('2d');
  canvasElement.width = width;
  canvasElement.height = height;
  ctx?.drawImage(img, tx, ty, width, height, 0, 0, width, height);
  const src = canvasElement.toDataURL("image/png");
  return src
}


export const exportImage = async (main: any, graffitiL: any[], mainContainer: Container, GraffitiContainer: Container) => {
  const rect = main instanceof EditText ? main.text : main instanceof EditGraphics ? main.graphics : main.sprite;
  const { width, height, x, y } = getBoundRect(rect);

  let graffitiSrc = '';
  let cropSrc = '';
  const common = {
    resolution: 12,
    antialias: true, // 抗锯齿
    autoDensity: true,
    transparent: true,
  }

  const imageApp = new Application({
    width,
    height,
    ...common,
  });
  const imageContainer = new Container();
  imageContainer.addChild(rect);
  imageApp.stage.addChild(imageContainer);
  const mainSrc = imageApp.renderer.plugins.extract.base64(imageContainer);
  mainContainer.addChild(rect);
  // // 底片 end

  const last = graffitiL[graffitiL.length - 1];
  if (last) {
    const { width: bw, height: bh, x: bx, y: by } = getBoundRect(last.brush);
    const cApp = new Application({
      width: bw,
      height: bh,
      resolution: 12,
      antialias: true, // 抗锯齿
      autoDensity: true,
      transparent: true,
    });
    const cContainer = new Container();
    const mask = new Graphics();
    mask.beginFill(0x000000, 0)
    mask.drawRect(bx, by, bw, bh);
    mask.endFill();

    mask.addChild(last.brush);
    cApp.stage.addChild(cContainer);
    cContainer.addChild(mask);
    graffitiSrc = cApp.renderer.plugins.extract.base64(cContainer);
    const image = cApp.renderer.plugins.extract.image(cContainer, "image/png", 1);

    GraffitiContainer.addChild(last.brush);
    await sleep(100)
    const tx = x - bx;
    const ty = y - by;
    const canvasElement = document.createElement('canvas')
    const ctx: any = canvasElement.getContext('2d')
    canvasElement.width = width
    canvasElement.height = height
    ctx.drawImage(image, tx, ty, width, height, 0, 0, width, height)
    cropSrc = canvasElement.toDataURL("image/png");
  }
  return {
    mainSrc,
    graffitiSrc,
    cropSrc,
  }
}

