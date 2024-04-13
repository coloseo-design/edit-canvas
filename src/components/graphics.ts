import { Graphics, InteractionEvent } from 'pixi.js';
import { lineStyle } from './operate';
import { getPoint, getBoundRect, uuid } from './utils';
import { positionType } from './canvas';
import CanvasStore from './store';

class EditGraphics {
  width: number;
  height: number;
  position: any;
  graphics: any;
  container: any;
  shape: any;
  radius: number;
  lineStyle: lineStyle;
  background: number;
  public app: any;
  private uuid: string;
  name: string;
  operate: any;
  alpha: number = 1;
  isEdit: boolean;
  constructor({
    width = 0,
    height = 0,
    position,
    container,
    shape = 'rect',
    radius = 0,
    lineStyle = {
      width: 0,
    },
    background = 0xff0000,
    operate,
    name = '',
    isEdit = true,
    alpha = 1,
  }: any) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.container = container;
    this.shape = shape;
    this.radius = radius;
    this.lineStyle = lineStyle;
    this.background = background;
    this.operate = operate;
    this.name = name;
    this.uuid = `${uuid()}`;
    this.isEdit = isEdit;
    this.alpha = alpha;
    this.paint();
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
    this.graphics.interactive = this.isEdit;
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
      this.graphics.isMove = true;
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