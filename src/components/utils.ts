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

// originS 主要用于画布伸缩移动后获取原来的宽高和位置，主要用于layer生成图片

export const getOriginPosition = (origin: positionType, originS?: boolean) => { // 获取原始的position，去除掉移动缩放的距离
  const { x: screenX, y: screenY } = originS ? { x: 0, y: 0 } : CanvasStore.screen;
  const { x: scaleX, y: scaleY } = originS ? {x: 1, y: 1 }: CanvasStore.scale;
  const moveX = screenX * scaleX;
  const moveY = screenY * scaleY;
  const originX = (origin.x + moveX) / scaleX;
  const originY = (origin.y + moveY) / scaleY;
  return {
    x: originX,
    y: originY,
  }
}

export const getBoundRect = (ele: any, originS?: boolean) => {
  if (ele) {
    const { x, y, width, height } = ele.getBounds();
    const { x: scaleX, y: scaleY } = originS ? { x: 1, y: 1 } : CanvasStore.scale;
    const { x: originX, y: originY } = getOriginPosition({ x, y }, originS);
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

export const getImage = (main: eleType | Container, third?: any) => {
  const rect = main instanceof Container ? main :  (main as any)[getPixiGra(main)] || '';
  if (rect) {
    const { width, height } = getBoundRect(rect, third?.isLayer);
    const imageApp = new Application({
      width,
      height,
      resolution: 2,
      antialias: true, // 抗锯齿
      autoDensity: true,
      transparent: true,
    });
    const imageContainer = new Container();
    imageContainer.addChild(rect);
    imageApp.stage.addChild(imageContainer);
    const mainSrc = imageApp.renderer.plugins.extract.base64(imageContainer);
    const img = imageApp.renderer.plugins.extract.image(imageContainer, "image/png", 1); // 用来裁剪
    third?.parent?.addChild(rect);
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

export const getBoxImage = async (
  container: eleType,
  main: eleType | Container,
  third?: any,
) => {
  const temp = main instanceof Container ? main : (main as any)[getPixiGra(main)];
  const { img } = getImage(main, third);
  const rect = (container as any)[getPixiGra(container)] || '';
  await sleep(100);
  const { x, y, width, height } = getBoundRect(rect, third?.isLayer);
  const { x: bx, y: by } = getBoundRect(temp, third?.isLayer);
  const tx = x - bx;
  const ty = y - by;
  const canvasElement: HTMLCanvasElement = document.createElement('canvas');
  const ctx: CanvasRenderingContext2D | null = canvasElement.getContext('2d');
  canvasElement.width = width;
  canvasElement.height = height;
  ctx?.drawImage(img, tx, ty, width, height, 0, 0, width, height);
  const src = canvasElement.toDataURL("image/png");
  return src;
}

