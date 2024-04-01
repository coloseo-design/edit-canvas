import { InteractionEvent, Graphics, Text, Application, Container } from 'pixi.js';
import EditText from './text';
import EditGraphics from './graphics';
import CanvasStore from './store';
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


export const loopChild = (data: any[] = [], editInfo: { x: number, y: number } | null = null) => {
  data.forEach((item) => {
    const { x, y } = getBoundRect(item);

    let x2 = 0, y2 = 0;
    if (item instanceof Text) {
      const x1 = editInfo ? x + editInfo.x : x;
      const y1 = editInfo ? y + editInfo.y : y;;
      (item as any).changePosition?.({ x: x1, y: y1 });
      item.position.set(x1, y1);
    }
    if (item instanceof Graphics) {
      x2 = item.x;
      y2 = item.y;
      const r = (item as any).shape === 'circle' ? (item as any)?.radius || 0 : 0;
      (item as any).changePosition?.({ x: x + r, y: y + r });
      item.clear();
      (item as any)?.repeat(getBoundRect(item));
      item.position.set(0, 0);
    }
    item?.parentData();
    if (item.children && item.children.length) {
      loopChild(item.children, item instanceof Graphics ? { x: x2, y: y2 } : null);
    }
  });
}

export type positionType = { x: number; y: number };

const sleep = (num: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(null), num);
  });


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

