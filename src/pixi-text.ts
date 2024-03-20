import PIXI, { InteractionEvent, Text, TextStyle, Container } from 'pixi.js';
import { getPoint, getBoundRect, overflowContainer } from './pixi-utils';
import { uuid } from './utils';
import CanvasStore from './store';


export type positionType = { x: number; y: number };

class EditText {
  public value: string = '';
  public position: positionType;
  public style: any | PIXI.TextStyle = {};
  public text: any;
  public container: any;
  public startPosition: positionType = { x: 0, y: 0 };
  public operate: any
  public width: number = 0;
  public height: number = 0;
  public uuid: string = `${uuid()}`;
  private parent: any = {};
  private rootContainer: Container;
  constructor({ width = 0, height = 0, value = '', style = {}, position = {}, container, rootContainer, operate }: any) {
    this.style = style;
    this.position = position;
    this.value = value;
    this.container = container;
    this.operate = operate;
    this.width = width;
    this.height = height;
    this.paintText();
    this.parentData();
    this.rootContainer = rootContainer;
  }

  private isDrag = false;


  paintText = () => {
    const textStyle = new TextStyle({ ...this.style });
    this.text = new Text(this.value, textStyle);
    this.text.interactive = true;
    this.text.buttonMode = true;
    this.text.resolution = 2;
    this.text.position.set(this.position.x, this.position.y);
    this.text.on('pointerdown', this.down);
    this.text.on('pointerup', this.up);
    this.text.uuid = this.uuid;
    this.text.changePosition = this.changePosition;
    this.text.parentData = this.parentData;
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
    if (this.container) {
      this.container.addChild(this.text);
    }
  }

  parentData = () => {
    this.parent = getBoundRect(this.container);
  }

  changePosition = ({ x, y, width, height }: positionType & { width: number, height: number}) => {
    this.position = { x, y };
    if (width) this.width = width;
    if (height) this.height = height;
  }

  down = (e: InteractionEvent) => {
    e.stopPropagation();
    this.isDrag = true;
    const startPosition = getPoint(e);
    this.startPosition = startPosition;
    this.move(startPosition);

  }
  move(start: positionType) {
    this.text.on('pointermove', (e: InteractionEvent) => {
      if (this.isDrag) {
        const scalePosition = getPoint(e);
        const x = (scalePosition.x - start.x) / CanvasStore.scale.x + this.position.x;
        const y = (scalePosition.y - start.y) / CanvasStore.scale.x + this.position.y;
        this.text.position.set(x, y);
        this.operate.clear();
      }
    });
  }
  up = (e: InteractionEvent) => {
    e.stopPropagation();
    if (this.isDrag) {
      this.isDrag = false;
      const isOverflow = overflowContainer(this.text, {...getBoundRect(this.container), width: this.parent.width, height: this.parent.height });
      if (isOverflow) {
        this.container.removeChild(this.text);
        this.rootContainer.addChild(this.text);
        this.container = this.rootContainer;
      }
      this.position = {
        x: getBoundRect(this.text).x,
        y: getBoundRect(this.text).y,
      };
      this.parentData();
    }
  }
}

export default EditText;
