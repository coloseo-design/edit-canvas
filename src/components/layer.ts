import { Graphics, Container, InteractionEvent } from 'pixi.js';
import type { positionType, boundRectType } from './utils';
import { getBoundRect, getPoint, uuid, getBoxImage } from './utils';
import OperateRect from './operate';
import Canvas from './canvas';
import CanvasStore from './store';

export interface LayerProps {
  position: positionType;
  width: number;
  height: number;
  background?: number;
  alpha?: number;
}

type layerAttr = {
  isDrag?: boolean;
  delete?: () => void;
  repeat?: () => void;
  changePosition?: (rect: boundRectType) => void;
  ele?: Layer;
} & Graphics

class Layer {
  position: positionType = { x: 0, y: 0 };
  width: number = 0;
  height: number = 0;
  operate!: OperateRect;
  app!: Canvas;
  layer!: layerAttr;
  container!: Container;
  uuid: string = `${uuid()}`;
  background: number;
  alpha: number;
  constructor({
    position,
    width,
    height,
    background = 0xffffff,
    alpha = 1,
  }: LayerProps) {
    this.position = position;
    this.height = height;
    this.width = width;
    this.background = background;
    this.alpha = alpha;
  }
  paint() {
    this.layer = new Graphics();
    this.layer.beginFill(this.background, this.alpha);
    this.layer.drawRect(this.position.x, this.position.y, this.width, this.height);
    this.layer.beginFill();
    this.layer.interactive = true;
    this.layer.buttonMode = true;
    this.layer.on('pointerdown', this.down);
    this.layer.on('pointerup', this.up);
    this.layer.ele = this;
    this.layer.delete = this.delete;
    this.layer.repeat = this.repeat;
    this.layer.changePosition = this.changePosition;
    this.container.addChild(this.layer);
    this.app?.setIndex(this.layer, this.container);
    this.app?.setIndex(this.operate.operateContainer, this.container);
    this.app.selected = this;
    this.operate.clear();
    this.operate.paint(getBoundRect(this.layer));
    this.operate.operateGraphical = this.layer;
  }

   public async getImage() {
    this.operate?.clear();
    this.layer.alpha = 0;
    this.app.app.ticker.remove(this.app.TickerUpdate);
    this.container.scale.set(1,1);
    this.container.position.set(0, 0);
    const src = await getBoxImage(this, this.container, { isLayer: true });
    this.app.app.ticker.add(this.app.TickerUpdate);
    this.layer.alpha = 1;
    this.app?.app.stage.addChild(this.app?.mainContainer);
    this.app?.app.stage.setChildIndex(this.container, 0);
    return src;
  }

  onClick(e: InteractionEvent) {

  }

  public getBoundRect() {
    return getBoundRect(this.layer);
  }

  delete() {
    this.app?.backCanvasList.push({
      deleteEle: this,
      type: 'Layer',
      kind: 'delete',
      uuid: this.uuid,
    });
    this.operate.clear();
    this.container.removeChild(this.layer);
  }
  changePosition = (rect: boundRectType) => {
    this.position = { x: rect.x, y: rect.y };
    if (rect.width) this.width = rect.width;
    if (rect.height) this.height = rect.height;
  }

  repeat = () => {
    this.layer.beginFill(0xffffff, 1);
    this.layer.drawRect(this.position.x, this.position.y, this.width, this.height);
    this.layer.endFill();
  }
  
  down = (e: InteractionEvent) => {
    e.stopPropagation();
    if (!this.app.isGraffiti) {
      this.app.backCanvasList.push({
        ...this.position,
        width: this.width,
        height: this.height,
        uuid: this.uuid,
        type: 'Graphics'
      });
      this.layer.isDrag = true;
      this.app.setIndex(this.layer, this.container);
      this.app.setIndex(this.operate?.operateContainer, this.container); // 设置操作框架层级
      this.move(getPoint(e));
    }
  }
  move(start: positionType) {
    this.layer.on('pointermove', (e: InteractionEvent) => {
      if (this.layer.isDrag) {
        const scalePosition = getPoint(e);
        const x = scalePosition.x - start.x;
        const y = scalePosition.y - start.y;
        this.layer.position.set(x / CanvasStore.scale.x, y / CanvasStore.scale.x);
        this.operate.clear();
      }
    });
  }

  up = (e: InteractionEvent) => {
    e.stopPropagation();
    if (this.layer.isDrag) {
      this.layer.isDrag = false;
      const { x, y, width, height } = getBoundRect(this.layer);
      this.operate?.paint({ x, y, width, height  });
      this.position = { x, y};
      this.layer.clear();
      this.repeat();
      this.layer.position.set(0, 0);
    }
  }
};

export default Layer;