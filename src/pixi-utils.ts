import { InteractionEvent, Graphics, Text, Sprite } from 'pixi.js';
import CanvasStore from './store';
export const getPoint = (e: InteractionEvent) => {
  return {
    // x: e.data.global.x + CanvasStore.screen.x / CanvasStore.scale.x,
    // y: e.data.global.y + CanvasStore.screen.y / CanvasStore.scale.y,
    x: e.data.global.x,
    y: e.data.global.y,
  }
};

export const getBoundRect = (ele: any) => {
  const { x, y, width, height } = ele.getBounds();
  const { x: screenX, y: screenY } = CanvasStore.screen;
  const { x: scaleX, y: scaleY } =  CanvasStore.scale;
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

export const overflowContainer = (ele: any, parent: any) => {
  const { x, y,  width: w, height: h, } = getBoundRect(ele);
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
  return {
    ax,
    ay
  }
}


export const loopChild = (data: any[] = [], editInfo: {x: number, y: number} | null = null) => {
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
      (item as any).changePosition?.({x: x + r, y: y + r });
      item.clear();
      (item as any)?.repeat();
      item.position.set(0, 0);
    }
    item?.parentData();
    if (item.children && item.children.length) {
      loopChild(item.children, item instanceof Graphics ? { x: x2, y: y2 } : null);
    }
  });
}

