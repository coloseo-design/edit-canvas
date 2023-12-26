import { InteractionEvent } from 'pixi.js';
import CanvasStore from './store';
export const getPoint = (e: InteractionEvent) => {
  return {
    x: e.data.global.x + CanvasStore.screen.x / CanvasStore.scale.x,
    y: e.data.global.y + CanvasStore.screen.y / CanvasStore.scale.y,
  }
};

