import { Graphics, InteractionEvent, Container } from 'pixi.js';
import { lineStyle } from './pixi-operate';
import { getPoint, getBoundRect, overflowContainer, loopChild } from './pixi-utils';
import { positionType } from './pixi-text';
import { uuid } from './utils';
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
  rootContainer: Container;
  public isDrag: boolean = false;
  startPosition: positionType = { x: 0, y: 0 };
  private parent: any = {};
  private uuid: string;
  name: string;
  operate: any;
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
    rootContainer,
    operate,
    name = '',
    isEdit = true,
  }: any) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.rootContainer = rootContainer;
    this.container = container;
    this.shape = shape;
    this.radius = radius;
    this.lineStyle = lineStyle;
    this.background = background;
    this.operate = operate;
    this.name = name;
    this.uuid = `${uuid()}`;
    this.isEdit = isEdit;
    this.paint();
    this.parentData();
  }

  parentData = () => {
    this.parent = getBoundRect(this.container);
  }
  paint() {
    this.graphics = new Graphics();
    this.graphics.name = this.name;
    this.graphics.uuid = this.uuid;
    this.graphics.repeat = this.repeat;
    this.graphics.changePosition = this.changePosition;
    this.graphics.parentData = this.parentData;
    this.graphics.radius = this.radius;
    this.graphics.shape = this.shape;
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

  changePosition = ({ x, y, width, height }: positionType & { width?: number, height?: number}) => {
    this.position = { x, y };
    if (width) this.width = width;
    if (height) this.height = height;
  }

  repeat = () => {
    this.graphics.beginFill(this.background, 1);
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
    this.isDrag = true;
    this.graphics.isMove = true;
    const startPosition = getPoint(e);
    this.startPosition = startPosition;
    this.move({x: e.data.global.x, y: e.data.global.y });


  }
  move(start: positionType) {
    this.graphics.on('pointermove', (e: InteractionEvent) => {
      if (this.isDrag) {
        const scalePosition = getPoint(e);
        // Graphics 容器里面的位置并不是实际的position x, y 是父级原点 0, 0;
        const x = scalePosition.x - start.x;
        const y = scalePosition.y - start.y;
        this.graphics.position.set(x / CanvasStore.scale.x, y / CanvasStore.scale.x);
        this.operate.clear();
      }
    });
  }

  up = (e: InteractionEvent) => { // 超出换Container TODO
    e.stopPropagation();
    this.isDrag = false;
    const isOverflow = overflowContainer(this.graphics, {...getBoundRect(this.container), width: this.parent.width, height: this.parent.height });
    const { x, y ,width, height } = getBoundRect(this.graphics);
    this.position = { x, y};
    if (isOverflow && this.isEdit) {
      this.container = this.rootContainer;
      this.container.removeChild(this.graphics);
      this.rootContainer.addChild(this.graphics);
      this.width = width;
      this.height = height;
      this.graphics.clear();
      this.repeat();
      if (this.graphics.children) {
        loopChild(this.graphics.children);
      }
      this.graphics.position.set(0, 0);
    }
    this.parentData();
  }
};

export default EditGraphics;