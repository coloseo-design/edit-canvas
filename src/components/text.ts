import { InteractionEvent, Text, TextStyle, Container } from 'pixi.js';
import { getPoint, getBoundRect, uuid, getImage } from './utils';
import type { positionType, boundRectType } from './utils';
import Canvas from './canvas';
import CanvasStore from './store';
import OperateRect from './operate';

export interface TextProps {
  width?: number;
  height?: number;
  value: string;
  style?: TextStyle | any;
  position: positionType;
}

type TextAttr = {
  ele?: EditText;
  isDrag?:  boolean;
  uuid?: string;
  changePosition?: (rect: boundRectType) => void;
  delete?: () => void;
} & Text;

class EditText {
  public value: string = '';
  public position: positionType;
  public style: any | TextStyle = {};
  public text!: TextAttr;
  public container!: Container;
  public operate!: OperateRect
  public width: number = 0;
  public height: number = 0;
  public uuid: string = `${uuid()}`;
  private input!: HTMLInputElement;
  public rootDom!: HTMLElement;
  private isPinyin: boolean = false;
  private isFocus: boolean = false;
  public app!: Canvas;
  constructor({ width = 0, height = 0, value = '', style, position }: TextProps) {
    this.style = style;
    this.position = position;
    this.value = value;
    this.width = width;
    this.height = height;
  }

  paint = () => {
    const textStyle = new TextStyle({ ...this.style });
    this.text = new Text(this.value, textStyle);
    this.text.interactive = true;
    this.text.buttonMode = true;
    this.text.resolution = 2;
    this.text.position.set(this.position.x, this.position.y);
    this.text.on('pointerdown', this.down);
    this.text.on('pointerup', this.up);
    this.text.uuid = this.uuid;
    this.text.isDrag = false;
    this.text.changePosition = this.changePosition;
    this.text.delete = this.delete;
    this.text.ele = this;
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
    this.createInput();
  }

  public getImage() {
    this.operate?.clear();
    this.app?.endGraffiti();
    const { base64 } = getImage(this);
    this.app?.mainContainer.addChild(this.text);
    return base64;
  }

  public getBoundRect() {
    return getBoundRect(this.text);
  }

  private createInput() {
    const input = document.createElement('input');
    input.setAttribute('style', 
    `position: absolute;
    height: ${this.text.height}px;
    min-width: ${this.width}px;
    left: ${(this.position.x || 0)}px;
    top: ${(this.position.y || 0)}px;
    border: none; outline: none;
    z-index: ${this.isFocus ? '100' : '-100'};
    font-size: ${this.style.fontSize}px;
    caret-color: black;
    color: transparent;
    background: transparent;
    `);
    this.input = input;
    this.input.value = this.value;
    this.input.addEventListener('input', this.oninput);
    this.input.addEventListener('focus', this.onfocus);
    this.input.addEventListener('blur', this.onblur);
    this.input.addEventListener('compositionstart', this.oncompositionstart);
    this.input.addEventListener('compositionend', this.oncompositionend);
    this.rootDom?.appendChild(input);
    if (this.isFocus) {
      input.focus();
    }

  }
  oninput = (e: any) => {
    if (!this.isPinyin) {
      this.value = (e.target as any)?.value;
      this.text.text = (e.target as any)?.value;
    }
  };

  writeText = (value?: string) => {
    this.isFocus = true;
    if (value) {
      this.value = value;
      this.text.text = value;
    }
    this.createInput();
  }

  onfocus = () => {
    this.isFocus = true;
    if (this.input) {
      this.input.style.zIndex = '100';
    }
  }

  onblur = () => {
    this.isFocus = false;
    if (this.input) {
      this.input.style.zIndex = '-100';
    }
  }

  oncompositionstart = () => {
    this.isPinyin = true;
  }

  oncompositionend = (e: any) => {
    this.isPinyin = false;
    this.oninput(e);
  }

  changePosition = ({ x, y, width, height }: boundRectType) => {
    this.position = { x, y };
    if (width) this.width = width;
    if (height) this.height = height;
  }

  delete = () => {
    this.container?.removeChild(this.text);
    this.operate?.clear();
  }

  onClick(e: InteractionEvent) {
  }

  private down = (e: InteractionEvent) => {
    e.stopPropagation();
    if (!this.app.isGraffiti) {
      this.app.backCanvasList.push({...this.position, width: this.width, height: this.height,  uuid: this.uuid, type: 'Text' });
      this.app.setIndex(this.text, this.container); // 设置当前元素层次
      this.app.setIndex(this.operate.operateContainer, this.container); // 设置操作框架层级
      this.text.isDrag = true;
      if (!this.isFocus) {
        this.move(getPoint(e));
      }
    }

  }
  private move(start: positionType) {
    this.text.on('pointermove', (e: InteractionEvent) => {
      if (this.text.isDrag) {
        const scalePosition = getPoint(e);
        const x = (scalePosition.x - start.x) / CanvasStore.scale.x + this.position.x;
        const y = (scalePosition.y - start.y) / CanvasStore.scale.x + this.position.y;
        this.text.position.set(x, y);
        this.operate.clear();
      }
    });
  }
  private up = (e: InteractionEvent) => {
    e.stopPropagation();
    if (this.text.isDrag) {
      this.text.isDrag = false;
      const { x, y ,width, height } = getBoundRect(this.text);
      this.operate?.paint({ x, y, width, height });
      this.position = {
        x,
        y,
      };
    }
  }
}

export default EditText;
