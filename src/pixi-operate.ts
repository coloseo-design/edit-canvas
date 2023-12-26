import PIXI, { Graphics, InteractionEvent } from 'pixi.js';
import { getPoint } from './pixi-utils';


type positionType = { x: number; y: number };

type lineStyle = { width?: number, color?: number, alpha?: number, alignment?: number, native?: boolean };

type argType = {
  w: number,
  h: number,
} & positionType;

class OperateRect {
  public lineStyle: lineStyle;
  public position: positionType;
  public width: number = 0;
  public height: number = 0;
  leftTop: PIXI.Graphics;
  leftBottom: PIXI.Graphics;
  rightTop: PIXI.Graphics;
  rightBottom: PIXI.Graphics;
  main: PIXI.Graphics;
  child: any;
  isDrag: boolean = false;
  startPosition: positionType = { x: 0, y: 0 };
  dirMap: any;
  x: number = 0;
  y: number = 0;
  originX: number = 0;
  originY: number = 0;
  originW: number = 0;
  originH: number = 0;
  root: HTMLElement | null = null;
  GraphicsList: any[] = [];
  multi: boolean = false;
  constructor({
    lineStyle = { width: 1, color: 0x0000ff },
    position = {},
  }: any) {
    this.lineStyle = lineStyle;
    this.position = position;
    this.main = new Graphics();
    this.leftBottom = new Graphics();
    this.leftTop = new Graphics();
    this.rightTop = new Graphics();
    this.rightBottom = new Graphics();
    this.dirMap = {
      'rightBottom': this.rightBottom,
      'leftBottom': this.leftBottom,
      'leftTop': this.leftTop,
      'rightTop': this.rightTop,
      'main': this.main,
    };
    this.paint({ x: 0, y: 0, width: 0, height: 0 }, true, true);
  }

  clear = () => {
    Object.values(this.dirMap).forEach((item: any) => {
      item.clear();
    });
  }

  paintRect = ({ x, y, w, h }: argType, init: boolean = false) => {
    Object.keys(this.dirMap).forEach((item) => {
      if (item === 'main') {
        if (init) {
          this.dirMap[item].interactive = true;
          this.dirMap[item].endFill();
          this.dirMap[item].on('pointerup', this.hornUp);
          this.dirMap[item].name = `${item}`;
        } else {
          this.dirMap[item].beginFill(0xffffff, 0.0001);
          this.dirMap[item].lineStyle(this.lineStyle.width, this.lineStyle.color, this.lineStyle.alpha, this.lineStyle.alignment, this.lineStyle.native);
          this.dirMap[item].drawRect(x - 4, y - 4, w + 8, h + 8);
        }
      } else {
        if (init) {
          this.dirMap[item].interactive = true;
          this.dirMap[item].name = `${item}`;
          // this.dirMap[item].on('pointerdown', (e: InteractionEvent) => {
          //   this.hornDown(item, e);
          // });
          this.dirMap[item].on('pointerup', this.hornUp);
          this.dirMap[item].endFill();
        } else {
          this.dirMap[item].beginFill(0xffffff);
          this.dirMap[item].lineStyle(1, 0x0000ff);
          const x1 = x - 8;
          const x2 = x + w;
          const y1 = y - 8;
          const y2 = y + h
          this.dirMap[item].drawRect(item.indexOf('left') > -1 ? x1 : x2, item.indexOf('Top') > -1 ? y1 : y2, 8, 8);
        }
      }
    })
  }

  paint = ({ x, y, width, height }: any, isSelf: boolean = false, init: boolean = false) => {
    if (!isSelf) {
      this.originX = x - 4;
      this.originY = y - 4;
      this.originW = width + 8;
      this.originH = height + 8;
    }
    this.width = isSelf ? width : width + 8;
    this.height = isSelf ? height : height + 8;
    this.x = isSelf ? x: x- 4;
    this.y = isSelf ? y: y - 4;
    
    this.paintRect({ x, y , w: width, h: height }, init);
  }
  hornDown = (type: string, e: InteractionEvent) => {
    this.isDrag = true;
    const startPosition = getPoint(e);
    this.startPosition = startPosition;
    this.hornMove(type);
    if (this.root) {
      this.root.style.cursor = this.getCursor(type);
    }
  }
  getCursor = (type: string) => {
    let cursor = 'default';
    switch(type) {
      case 'leftBottom': 
      cursor = 'nesw-resize';
        break;
      case 'leftTop':
        cursor = 'nwse-resize'
        break;
      default:
        cursor = 'default';
        break;   
    }
    return cursor;
  }
  hornMove = (type: string) => {
    this.dirMap[type].on('pointermove', (e: InteractionEvent) => {
      if (this.isDrag) {
        this.diffMove(type, e);
      }
    })
  }

  diffMove = (type: string, e: InteractionEvent) => {
    this.clear();
    const scalePosition = getPoint(e);
    const diffX = scalePosition.x - this.startPosition.x + this.dirMap[type].x;
    const diffY = scalePosition.y - this.startPosition.y + this.dirMap[type].y;
    let x = this.originX, y = this.originY, width = this.originW, height = this.originH;
    if (type === 'leftBottom') {
      x = x + diffX;
      width = width - diffX;
      height = height + diffY;
    }
    if (type === 'leftTop') {
      x = x + diffX;
      y = y + diffY;
      width = width - diffX;
      height = height - diffY;
    }
    if (type === 'rightTop') {
      y = y + diffY;
      width = width + diffX;
      height = height - diffY;
    }
    if (type === 'rightBottom') {
      width = width + diffX;
      height = height + diffY;
    }
    if (type === 'main') {
      x = diffX + x;
      y = diffY + y;
    }
    this.paint({ x, y, width, height }, true);
    (this.main.children || []).forEach((item: any) => {
      this.GraphicsList.filter((i, index) => {
        if (i.uuid === item.uuid) {
          item.position.set(i.position.x + diffX, i.position.y + diffY);
        }
      })
    });
  }

  hornUp = (e: InteractionEvent) => {
    if (this.isDrag) {
      this.isDrag = false;
      const scalePosition = getPoint(e);
      const diffX = scalePosition.x - this.startPosition.x + this.dirMap['main'].x;
      const diffY = scalePosition.y - this.startPosition.y + this.dirMap['main'].y;
      (this.main.children || []).forEach((item: any) => {
        this.GraphicsList.filter((i) => {
          if (i.uuid === item.uuid) {
            i.position = {
              x: i.position.x + diffX,
              y: i.position.y + diffY,
            }
          }
        })
      });
    }
  }
}

export default OperateRect;
