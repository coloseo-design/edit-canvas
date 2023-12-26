import PIXI, { InteractionEvent, Loader, Sprite } from 'pixi.js';
import { getPoint } from './pixi-utils';


type positionType = { x: number; y: number };

class EditImage {
  public url: string = '';
  public position: positionType;
  public sprite: any;
  public containerT: any;
  public startPosition: positionType = { x: 0, y: 0 };
  public width: number = 0;
  public height: number = 0;
  public operate: any;
  public text: any;
  constructor({ url = '', position = {}, container, width, height, operate, text }: any) {
    this.url = url;
    this.position = position;
    this.containerT = container;
    this.width = width;
    this.height = height;
    this.operate = operate;
    this.text = text;
    this.paint();
  }

  private isDrag = false;


  paint = () => {
    new Loader().add('myImage', this.url).load((loader, resources) => {
      if (resources) {
        const myTexture = resources['myImage']?.texture
        this.sprite = new Sprite(myTexture);
        this.sprite.position.set(this.position.x, this.position.y); //设置位置
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.sprite.interactive = true;
        // 配置文字遮罩层
        if (this.text) {
          this.sprite.mask = this.text;
        }
        this.sprite.on('pointerdown', this.down);
        this.sprite.on('pointerup', this.up);
        if (this.containerT) {
          this.containerT.addChild(this.sprite);
        }
      }
    });
  }

  change = ({ x, y, w, h}: any) => {
    this.sprite.position.set(x, y);
    this.position = { x,y };
    this.sprite.width = w;
    this.sprite.height = h;
  }

  down = (e: InteractionEvent) => {
    this.isDrag = true;
    const startPosition = getPoint(e);
    this.startPosition = startPosition;
    this.move(startPosition);
    this.operate.clear();
    this.operate.child = this;
    this.operate.paint({ x: this.position.x, y: this.position.y, width: this.sprite.width, height: this.sprite.height });

  }
  move(start: positionType) {
    this.sprite.on('pointermove', (e: InteractionEvent) => {
      if (this.isDrag) {
        const scalePosition = getPoint(e);
        const x = (scalePosition.x - start.x) + this.position.x;
        const y = (scalePosition.y - start.y) + this.position.y;
        this.sprite.position.set(x, y);
        this.operate.clear();
      }
    });
  }
  up = (e: InteractionEvent) => {
    if (this.isDrag) {
      this.isDrag = false;
      const scalePosition = getPoint(e);
      this.position = {
        x: (scalePosition.x - this.startPosition.x) + this.position.x,
        y: (scalePosition.y - this.startPosition.y) + this.position.y
      }
      this.operate.paint({ x: this.position.x, y: this.position.y, width: this.sprite.width, height: this.sprite.height });
    }
  }
}

export default EditImage;
