import { Graphics } from 'pixi.js';


const ShapeMap = {
'rect': 'drawRect',
'circle': 'drawCircle',
}

class EditGraphics {
  width: number;
  height: number;
  position: any;
  operate: any;
  graphics: any;
  container: any;
  shape: any;
  constructor({ width = 0, height = 0, position, operate, container, shape = 'circle' }: any) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.operate = operate;
    this.container = container;
    this.shape = shape;
    this.paint();
  }
  paint() {
    this.graphics = new Graphics();
    this.graphics.lineStyle(0);
    this.graphics.beginFill(0xF72F48, 1);
    this.graphics.drawCircle(600, 600, 50);
    this.graphics.endFill();
    this.graphics.antialias = true;
    this.graphics.autoDensity = true;
    this.graphics.interactive = true;  // 交互模式
    this.container.addChild(this.graphics);
  }
};

export default EditGraphics;