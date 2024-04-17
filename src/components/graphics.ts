import { Graphics, InteractionEvent, Container } from 'pixi.js';
import { lineStyle } from './operate';
import { getPoint, getBoundRect, uuid, getImage } from './utils';
import type { positionType, boundRectType } from './utils';
import CanvasStore from './store';
import OperateRect from './operate';
import Canvas from './canvas';

type shapeT = 'rect' | 'circle' | 'roundedRect';

export interface GraphicsProps {
  position: positionType;
  width: number;
  height: number;
  shape?: shapeT;
  radius?: 0;
  lineStyle?: lineStyle;
  background?: number;
  name?: string;
  alpha?: number;
}


type graphicsAttr = {
  uuid?: string;
  repeat?: () => void;
  changePosition?: (rect: boundRectType) =>  void;
  delete?: () => void;
  radius?: number;
  ele?: EditGraphics;
  shape?: shapeT;
  isDrag?: boolean;
  antialias?: boolean;
  autoDensity?: boolean;
} & Graphics;

class EditGraphics {
  width: number;
  height: number;
  position: positionType;
  graphics!: graphicsAttr;
  container!: Container;
  shape: shapeT;
  radius: number;
  lineStyle: lineStyle;
  background: number;
  public app!: Canvas;
  public uuid: string;
  name: string;
  operate!: OperateRect;
  alpha: number;
  constructor({
    width = 0,
    height = 0,
    position,
    shape = 'rect',
    radius = 0,
    lineStyle = {
      width: 0,
    },
    background = 0xff0000,
    name = '',
    alpha = 1,
  }: GraphicsProps) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.shape = shape;
    this.radius = radius;
    this.lineStyle = lineStyle;
    this.background = background;
    this.name = name;
    this.uuid = `${uuid()}`;
    this.alpha = alpha;
    this.paint();
  }

  public getImage() {
    this.app?.endGraffiti();
    const { base64 } = getImage(this);
    this.app?.mainContainer.addChild(this.graphics);
    return base64;
  }

  public delete = () => {
    this.container.removeChild(this.graphics)
    this.operate?.clear?.();
  }

  public paint() {
    this.graphics = new Graphics();
    this.graphics.name = this.name;
    this.graphics.uuid = this.uuid;
    this.graphics.repeat = this.repeat;
    this.graphics.changePosition = this.changePosition;
    this.graphics.delete = this.delete;
    this.graphics.radius = this.radius;
    this.graphics.ele = this;
    this.graphics.shape = this.shape;
    this.graphics.isDrag = false;
    this.repeat();
    this.graphics.on('pointerdown', this.down);
    this.graphics.on('pointerup', this.up);
    this.graphics.antialias = true; // 抗锯齿
    this.graphics.autoDensity = true;// 模糊处理
    this.graphics.interactive = true;
    this.graphics.buttonMode = true;
    if (this.container) {
      this.container.addChild(this.graphics);
    }
  }

  public getBoundRect() {
    return getBoundRect(this.graphics);
  }
  onClick(e: InteractionEvent) {
  }
  public changePosition = ({ x, y, width, height }: positionType & { width?: number, height?: number}) => {
    this.position = { x, y };
    if (width) this.width = width;
    if (height) this.height = height;
  }

  public repeat = () => {
    this.graphics.beginFill(this.background, this.alpha);
    this.graphics.lineStyle(this.lineStyle.width, this.lineStyle.color, this.lineStyle.alpha, this.lineStyle.alignment, this.lineStyle.native);
    if (this.shape === 'circle') {
      this.graphics.drawCircle(this.position.x, this.position.y, this.radius)
    }
    if (this.shape === 'rect') {
      this.graphics.drawRect(this.position.x, this.position.y, this.width, this.height);
    }
    if (this.shape === 'roundedRect') {
      this.graphics.drawRoundedRect(this.position.x, this.position.y, this.width, this.height, this.radius);
    }
    this.graphics.endFill();
  }
  
  down = (e: InteractionEvent) => {
    e.stopPropagation();
    if (!this.app.isGraffiti) {
      this.app.backCanvasList.push({...this.position, width: this.width, height: this.height, uuid: this.uuid, type: 'Graphics' });
      this.graphics.isDrag = true;
      this.move(getPoint(e));
    }
  }
  move(start: positionType) {
    this.graphics.on('pointermove', (e: InteractionEvent) => {
      if (this.graphics.isDrag) {
        const scalePosition = getPoint(e);
        // Graphics 容器里面的位置并不是实际的position x, y 是父级原点 0, 0;
        const x = scalePosition.x - start.x;
        const y = scalePosition.y - start.y;
        this.graphics.position.set(x / CanvasStore.scale.x, y / CanvasStore.scale.x);
        this.operate.clear();
      }
    });
  }

  up = (e: InteractionEvent) => {
    e.stopPropagation();
    if (this.graphics.isDrag) {
      this.graphics.isDrag = false;
      const { x, y } = getBoundRect(this.graphics);
      this.position = { x, y};
      this.graphics.clear();
      this.repeat();
      this.graphics.position.set(0, 0);
    }
  }
};

export default EditGraphics;