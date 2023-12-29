import PIXI, { InteractionEvent, Text } from 'pixi.js';
import { getPoint } from './pixi-utils';
import { uuid } from './utils';


type positionType = { x: number; y: number };

class EditText {
  public value: string = '';
  public position: positionType;
  public style: any | PIXI.TextStyle = {};
  public text: any;
  public containerT: any;
  public startPosition: positionType = { x: 0, y: 0 };
  public operate: any
  public width: number = 0;
  public height: number = 0;
  public uuid: string = `${uuid()}`;
  constructor({ width = 0, height = 0, value = '', style = {}, position = {}, container, resolution = 2, operate }: any) {
    this.style = style;
    this.position = position;
    this.value = value;
    this.containerT = container;
    this.operate = operate;
    this.width = width;
    this.height = height;
    this.paintText();
  }

  private isDrag = false;

  paintText = () => {
    this.text = new Text(this.value);
    this.text.interactive = true;
    this.text.buttonMode = true;
    this.text.style = this.style;
    this.text.resolution = 2;
    this.text.position.set(this.position.x, this.position.y);
    this.text.on('pointerdown', this.down);
    this.text.on('pointerup', this.up);
    this.text.uuid = this.uuid;
    if (this.width) {
      this.text.width = this.width;
    } else {
      this.width = this.text.width;
    }
    if (this.height) {
      this.text.height = this.height;
    } else {
      this.height = this.text.height;
    }
    if (this.containerT) {
      this.containerT.addChild(this.text);
    }
  }

  change = ({ x, y }: positionType) => {
    this.text.position.set(x, y);
    this.position = { x, y }
  }

  down = (e: InteractionEvent) => {
    e.stopPropagation();
    this.isDrag = true;
    const startPosition = getPoint(e);
    this.startPosition = startPosition;
    this.containerT.removeChild(this.text);
    this.operate.main.addChild(this.text);
    this.move(startPosition);
    this.operate.clear();
    this.operate.paint({ x: this.position.x, y: this.position.y, width: this.text.width, height: this.text.height });

  }
  move(start: positionType) {
    this.text.on('pointermove', (e: InteractionEvent) => {
      if (this.isDrag) {
        const scalePosition = getPoint(e);
        const x = (scalePosition.x - start.x) + this.position.x;
        const y = (scalePosition.y - start.y) + this.position.y;
        this.text.position.set(x, y);
        this.operate.clear();
      }
    });;
  }
  up = (e: InteractionEvent) => {
    if (this.isDrag) {
      this.isDrag = false;
      const scalePosition = getPoint(e);
      this.position = {
        x: (scalePosition.x - this.startPosition.x) + this.position.x,
        y: (scalePosition.y - this.startPosition.y) + this.position.y
      }
      this.operate.main.addChild(this.text);
      this.containerT.addChild(this.text);
      this.operate.paint({
        x: this.position.x,
        y: this.position.y,
        width: this.text.width,
        height: this.text.height,
      });
    }
  }
}

export default EditText;
