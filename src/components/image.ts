import { InteractionEvent, Loader, Sprite } from 'pixi.js';
import { getPoint, uuid, getBoundRect, getImage } from './utils';
import CanvasStore from './store';
import Canvas from './canvas';
import OperateRect from './operate';

type positionType = { x: number; y: number };

type SP = {
  changePosition?: (obj: positionType & { width: number, height: number}) => void;
  delete?: () => void;
  ele?: EditImage;
  uuid?: string;
  isDrag?: boolean;
} & Sprite

class EditImage {
  public url: string = '';
  public position: positionType = {x: 0, y: 0 };
  public sprite!: SP;
  public container: any;
  public width: number = 0;
  public height: number = 0;
  public operate: OperateRect;
  public text: string = '';
  public app!: Canvas;
  public uuid: string = `${uuid()}`;
  constructor({ url = '', position = {}, container, width, height, operate, text }: any) {
    this.url = url;
    this.position = position;
    this.container = container;
    this.width = width;
    this.height = height;
    this.operate = operate;
    this.text = text;
  }

  delete = () => {
    this.operate?.clear();
    this.container?.removeChild?.(this.sprite);
  }
  paint = () => {
    new Loader().add('myImage', this.url).load((loader, resources) => {
      if (resources) {
        const myTexture = resources['myImage']?.texture
        this.sprite = new Sprite(myTexture);
        this.sprite.position.set(this.position.x, this.position.y); //设置位置
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.changePosition = this.changePosition;
        this.sprite.delete = this.delete;
        this.sprite.ele = this;
        this.sprite.uuid = this.uuid;
        this.sprite.on('pointerdown', this.down);
        this.sprite.isDrag = false;
        this.sprite.on('pointerup', this.up);
        if (this.container) {
          this.container.addChild(this.sprite);
        }
      }
    })
  }

  onClick(e: InteractionEvent) {
  }

  public getImage() {
    this.app?.endGraffiti();
    const { base64 } = getImage(this);
    this.sprite && this.app?.mainContainer.addChild(this.sprite);
    return base64;
  }

  getBoundRect() {
    return getBoundRect(this.sprite);
  }

  changePosition = ({ x, y, width, height }: positionType & { width: number, height: number}) => {
    this.position = { x, y };
    if (width && this.sprite) {
      this.sprite.width = width;
      this.width = width
    }

    if (height && this.sprite) {
      this.sprite.height = height;
      this.height = height;
    }
  }

  private down = (e: InteractionEvent) => {
    if (!this.app?.isGraffiti) {
      this.app?.backCanvasList.push({...getBoundRect(this.sprite), uuid: this.uuid, type: 'Image' });
      if (this.sprite) {
        this.sprite.isDrag = true;
      }
      this.move(getPoint(e));
    }

  }
  private move(start: positionType) {
    this.sprite?.on('pointermove', (e: InteractionEvent) => {
      if (this.sprite?.isDrag) {
        const scalePosition = getPoint(e);
        const x = (scalePosition.x - start.x) / CanvasStore.scale.x + this.position.x;
        const y = (scalePosition.y - start.y) / CanvasStore.scale.x + this.position.y;
        this.sprite.position.set(x, y);
        this.operate.clear();
      }
    });
  }
  private up = () => {
    if (this.sprite?.isDrag) {
      this.sprite.isDrag = false;
      this.position = {
        x: this.sprite.x,
        y: this.sprite.y,
      }
    }
  }
}

export default EditImage;
