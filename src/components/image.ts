import { InteractionEvent, Loader, Sprite } from 'pixi.js';
import { getPoint, uuid, getBoundRect } from './utils';
import CanvasStore from './store';
import Canvas from './canvas';

type positionType = { x: number; y: number };

class EditImage {
  public url: string = '';
  public position: positionType;
  public sprite: any;
  public container: any;
  public width: number = 0;
  public height: number = 0;
  public operate: any;
  public text: any;
  public app: Canvas | null = null;
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
        this.sprite.changePosition = this.changePosition;
        this.sprite.delete = this.delete;
        this.sprite.ele = this;
        this.sprite.uuid = this.uuid;
        // 配置文字遮罩层
        if (this.text) {
          this.sprite.mask = this.text;
        }
        this.sprite.on('pointerdown', this.down);
        this.sprite.isDrag = false;
        this.sprite.on('pointerup', this.up);
        if (this.container) {
          this.container.addChild(this.sprite);
        }
      }
    });
  }

  // change = ({ x, y, w, h}: any) => {
  //   this.sprite.position.set(x, y);
  //   this.position = { x,y };
  //   this.sprite.width = w;
  //   this.sprite.height = h;
  // }

  changePosition = ({ x, y, width, height }: positionType & { width: number, height: number}) => {
    this.position = { x, y };
    if (width) {
      this.sprite.width = width;
      this.width = width
    }

    if (height) {
      this.sprite.height = height;
      this.height = height;
    }
  }

  down = (e: InteractionEvent) => {
    if (!this.app?.isGraffiti) {
      this.app?.backCanvasList.push({...getBoundRect(this.sprite), uuid: this.uuid, type: 'Image' });
      this.sprite.isDrag = true;
      this.move(getPoint(e));
    }

  }
  move(start: positionType) {
    this.sprite.on('pointermove', (e: InteractionEvent) => {
      if (this.sprite.isDrag) {
        const scalePosition = getPoint(e);
        const x = (scalePosition.x - start.x) / CanvasStore.scale.x + this.position.x;
        const y = (scalePosition.y - start.y) / CanvasStore.scale.x + this.position.y;
        this.sprite.position.set(x, y);
        this.operate.clear();
      }
    });
  }
  up = () => {
    if (this.sprite.isDrag) {
      this.sprite.isDrag = false;
      this.position = {
        x: this.sprite.x,
        y: this.sprite.y,
      }
    }
  }
}

export default EditImage;
