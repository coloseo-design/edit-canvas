import { Graphics, InteractionEvent, Container, Sprite } from 'pixi.js';
import { getBoundRect, uuid, getImage, getBoxImage, GraffitiToSprite } from './utils';
import type { eleType, positionType, boundRectType } from './utils';
import { getPoint, getOriginPosition } from './utils';
import CanvasStore from './store';
import Canvas from './canvas';
import OperateRect from './operate';


export interface GraffitiType {
  color?: number,
  lineWidth?: number,
  alpha?: number,
}

type brushAttr = {
  repeat?: (rect: boundRectType) => void;
  changePosition?: (rect: boundRectType) => void;
  ele?: Graffiti;
  delete?: () => void;
  isDrag?: boolean;
  paint?: (e: InteractionEvent) => void;
  uuid?: string;
  originImage?: any;
} & Graphics;



class Graffiti {
  public brush!: brushAttr;
  public color: number;
  public lineWidth: number;
  public children: Graffiti[] = [];
  public uuid: string = `${uuid()}`;
  public deleteChildren: Graffiti[] = []
  app!: Canvas;
  operate!: OperateRect;
  container!: Container;
  alpha: number;
  start: positionType = { x: 0, y: 0};
  position: positionType = { x: 0, y: 0};
  originImage: any;
  constructor(props?: GraffitiType) {
    const { color = 0x6078F4, lineWidth = 10, alpha = 0.5 } = props || {};
    const brush = new Graphics();
    this.brush = brush;
    this.color = color;
    this.brush.repeat = this.repeat;
    this.brush.ele = this;
    this.lineWidth = lineWidth;
    this.brush.delete = this.delete;
    this.brush.paint = this.paint;
    this.brush.changePosition = this.changePosition;
    this.originImage = this.brush;
    this.alpha = alpha;
    this.brush.uuid = this.uuid;
    this.brush.on('pointerdown', (e: InteractionEvent) => {
      this.onPointerdown(e);
      this.down(e);
    });
    this.brush.on('pointerup', (e: InteractionEvent) => {
      this.onPointerup(e);
      this.up();
    });
    this.brush.on('click', (e: InteractionEvent) => {
      this.onClick(e);
    })
  }

  changePosition = ({ x, y }: boundRectType) => {
    this.position = { x, y };
  }

  paint = (e: InteractionEvent) => {
    const scalePosition = getOriginPosition(getPoint(e));
    this.brush.beginFill(this.color, this.alpha);
    this.brush.isDrag = false;
    this.brush.drawCircle(scalePosition.x, scalePosition.y, this.lineWidth);
    this.brush.endFill();

  }

  onClick(e: InteractionEvent) {}
  onPointerdown(e: InteractionEvent) {}
  onPointerup(e: InteractionEvent) {}

  public setStyle({ color, alpha, lineWidth }: GraffitiType) {
    if (color) {
      this.color = color;
    }
    if (lineWidth) {
      this.lineWidth = lineWidth;
    }
    if (alpha) {
      this.alpha = alpha;
    }
  }

  public delete = () => {
    this.app.GraffitiList = (this.app.GraffitiList || []).filter((i) => i.uuid !== this.uuid);
    this.container?.removeChild(this.brush);
    this.operate?.clear?.();
  }

  public async getImage(container?: eleType) {
    this.operate?.clear();
    this.app?.endGraffiti();
    if (container) {
      const src = await getBoxImage(container, this, { isGraffiti: true, parent: this.container });
      this.hasId();
      return src; 
    } else {
      const { base64 } = getImage(this, { isGraffiti: true, parent: this.container });
      this.hasId();
      return base64;
    }
  }
  private hasId = () => {
    this.brush = this.originImage;
    GraffitiToSprite(this, this.app.app, this.position);
  }

  private repeat = (rect: boundRectType) => {
    this.brush.drawRect(rect.x, rect.y, rect.width, rect.height);
    this.brush.endFill();
  }

  public getBoundRect() {
    return getBoundRect(this.brush);
  }


  changeChild = (child: any) => {
    this.brush = child;
  }
  
  down = (e: InteractionEvent) => { // TODO
    e.stopPropagation();
    if (!this.app.isGraffiti) {
      this.app?.backCanvasList.push({
        ...getBoundRect(this.brush),
        uuid: this.uuid,
        type: 'Graffiti',
        kind: 'move',
      });
      this.brush.isDrag = true;
      this.start = getPoint(e);
      this.app?.setIndex(this.brush, this.container);
      this.app?.setIndex(this.operate.operateContainer, this.app?.mainContainer); // 设置操作框架层级
      this.move();
    }
  }
  private move = () => {
    this.brush.on('pointermove', (e: InteractionEvent) => {
      if (this.brush.isDrag) {
        const scalePosition = getPoint(e);
        const spriteP = this.brush instanceof Sprite ? { x: this.position.x, y: this.position.y } : { x: 0, y: 0}
        const x = (scalePosition.x - this.start.x) / CanvasStore.scale.x + spriteP.x;
        const y = (scalePosition.y - this.start.y)/ CanvasStore.scale.x + spriteP.y;
        this.brush.position.set(x, y);
        this.operate.clear();
      }
    });
  }

  up = () => {
    if (this.brush.isDrag) {
      this.brush.isDrag = false;
      const rect = getBoundRect(this.brush);
      this.operate?.paint(rect);
      this.position = {
        x: rect.x,
        y: rect.y,
      }
    }
  }
};

export default Graffiti;