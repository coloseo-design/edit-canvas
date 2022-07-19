import { uuid } from './utils';

interface BaseRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  Canvas?: DragCanvas;
  radian?: number;
  uuid?: string;
}

interface imageProps extends BaseRectProps {
  img: HTMLImageElement;
}

interface RectProps extends BaseRectProps {
  color: string;
}

interface BaseHornProps {
  x: number;
  y: number;
  width: number;
  height: number;
  radian: number; // 容器的旋转弧度
}

interface HornProps extends BaseHornProps {
  direction: string;
  cursor: string; // 鼠标样式
  containterX: number; // 容器的x
  containterY: number; // 容器的y
  cancel: boolean; // 表示取消图形
  color: string; // 矩形边框的颜色
  x2?: number; // 旋转连接线的linetox
  y2?: number; // 旋转连接线的linetoy
  Canvas: DragCanvas;
}


class DragCanvas {
  public canvas :HTMLCanvasElement;

  public editCtx:CanvasRenderingContext2D;

  public rectList: RectProps[]  = []; // 矩形列表

  public imageList: imageProps[] = []; // 图片列表

  public hornList: HornProps[] = []; // 顶角数据

  public hornW = 16;

  protected currentShape: any;

  public currentContainter: any;

  public backOperation: any = [];
  
  constructor(canvas:HTMLCanvasElement) {
    this.canvas = canvas;
    this.editCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.init()
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  isPosInRotationRect(point: any, shape: any, hornRadinCenter?: any) {
    let hw = shape.width / 2;
    let hh = shape.height / 2
    let radian = shape.radian;
    let center = shape.position;
    let X = point.x;
    let Y = point.y;
    const angle = radian * 180 / Math.PI;
    let r = -angle * Math.PI/180;
    // 当前点击图形上四个顶角和旋转框框是，旋转的中心不是自己的中心的点，而是四个顶角的父级中心点
    const radianCenter = hornRadinCenter && radian ? hornRadinCenter : center;

    let nTempX = radianCenter.x + (X - radianCenter.x) * Math.cos(r) - (Y - radianCenter.y) * Math.sin(r);
    let nTempY = radianCenter.y + (X - radianCenter.x) * Math.sin(r) + (Y - radianCenter.y) * Math.cos(r);
    if (nTempX > center.x - hw && nTempX < center.x + hw && nTempY > center.y - hh && nTempY < center.y + hh) {
        return true;
    }
    return false
  }

  init() {
    this.editCtx.globalCompositeOperation = "multiply";
    this.canvas.addEventListener('mousedown', this.onmousedown.bind(this));
    this.canvas.addEventListener('mousemove', this.mousemove.bind(this));
  }

  createRect(option: RectProps) {
    option.Canvas = this;
    option.uuid = uuid();
    this.rectList.push(new Rect(option));
    this.paintRect();
  }

  createImage(option: imageProps) {
    option.Canvas = this;
    option.uuid = uuid();
    const imgRect = new ImageRect(option);
    this.imageList.push(imgRect);
    this.paintImage(true);
  }

  paintHorn(option: BaseHornProps, cancel: boolean = false) { // cancel为true表示没有点击到图形上，清除horn
    const { x, y, width: w, height: h, radian } = option;
    const intersectionW = this.hornW / 2;
  
    const basehorn = {
      radian,
      Canvas: this,
      width: w,
      height: h,
      containterX: x,
      containterY: y,
      cancel,
      color: 'red',
    }
    const rightTop = { direction: 'rightTop',  x: x - intersectionW + w, y: y - intersectionW, cursor: 'nesw-resize' };
    const leftTop = { direction: 'leftTop', x: x - intersectionW, y: y - intersectionW, cursor: 'nwse-resize' };
    const leftBottom = { direction: 'leftBottom', x: x - intersectionW, y: y - intersectionW + h, cursor: 'nesw-resize' };
    const rightBottom = { direction: 'rightBottom', x: x - intersectionW + w, y: y - intersectionW + h, cursor: 'nwse-resize' };
    const topMiddle = { direction : 'topMiddle', x: x + w / 2 - intersectionW, y: y - intersectionW, cursor: 'ns-resize' };
    const leftMiddle = { direction : 'leftMiddle', x: x - intersectionW, y: y + h / 2 - intersectionW, cursor: 'ew-resize' };
    const rightMiddle = { direction : 'rightMiddle', x: x + w - intersectionW, y: y + h / 2 - intersectionW, cursor: 'ew-resize' };
    const bottomMiddle = { direction : 'bottomMiddle', x: x + w / 2 - intersectionW, y: y + h - intersectionW, cursor: 'ns-resize' };
    const rotateRect = { direction : 'rotate', x: x + w / 2 - intersectionW, y: y - intersectionW - 40, cursor: 'crosshair' };
    const rotateLine = { direction: 'rotateLine', x: x + w / 2, y: y - 40 + intersectionW, x2:  x + w / 2, y2: y - intersectionW, cursor: 'default '};

    const hornList: any = [
      new Horn({ ...rightTop, ...basehorn }),
      new Horn({ ...leftTop, ...basehorn }),
      new Horn({ ...leftBottom, ...basehorn }),
      new Horn({ ...rightBottom, ...basehorn }),
      new Horn({ ...topMiddle, ...basehorn }),
      new Horn({ ...leftMiddle, ...basehorn }),
      new Horn({ ...rightMiddle, ...basehorn}),
      new Horn({ ...bottomMiddle, ...basehorn }),
      new Horn({ ...rotateRect, ...basehorn }),
      new Horn({ ...rotateLine, ...basehorn }),
    ];

    this.hornList = hornList;
  }

  ImageRotate(ele: imageProps) {
    this.editCtx.save();
    this.editCtx.translate(ele.x + ele.width / 2, ele.y + ele.height / 2);
    this.editCtx.rotate(ele?.radian || 0);
    this.editCtx.translate(-(ele.x + ele.width / 2), -(ele.y + ele.height / 2));
    this.editCtx.drawImage(ele.img, ele.x, ele.y, ele.width, ele.height);
    this.editCtx.restore();
  }

  back(step: number = 1) {
    const stepIndex = step > this.backOperation.length ? 0 : this.backOperation.length - step;
    const lastOperation = this.backOperation[stepIndex];
    if (lastOperation instanceof ImageRect) {
      this.imageList.forEach((item) => {
        if (item?.uuid === lastOperation?.uuid) {
          Object.assign(item, {
            ...lastOperation,
          });
        }
      });
    }
    if (lastOperation instanceof Rect) {
      this.rectList.forEach((item) => {
        if (item?.uuid === lastOperation?.uuid) {
          Object.assign(item, {
            ...lastOperation,
          });
        }
      });
    }
    this.paintRect();
    this.paintImage();
    this.paintHorn(this.currentContainter);
  }

  paintImage(first?: boolean) {
    this.imageList.forEach((ele: imageProps) => {
      if (ele.img) {
        if (!first) {
          this.ImageRotate(ele);
        } else {
          ele.img.onload = () => {
            this.ImageRotate(ele);
          }
        }
      }
    });
  }

  paintRect() {
    this.editCtx.clearRect(0, 0, this.width, this.height);
    this.rectList.forEach(ele => {
      this.editCtx.save();
      this.editCtx.beginPath()
      this.editCtx.translate(ele.x + ele.width / 2, ele.y + ele.height / 2);
      this.editCtx.rotate(ele.radian ?? 0);
      this.editCtx.translate(-(ele.x + ele.width / 2), -(ele.y + ele.height / 2));
      this.editCtx.rect(ele.x, ele.y, ele.width, ele.height);
      this.editCtx.strokeStyle = ele.color;
      this.editCtx.stroke();
      this.editCtx.restore();
    });
  }

  Operations(downinfo: any, containter: any, ishorn: boolean) {
    if (ishorn) { // 点击四个顶角旋转角
      if (containter instanceof Rect) {
        this.backOperation.push(new Rect({ ...containter }));
      }
      if (containter instanceof ImageRect) {
        this.backOperation.push(new ImageRect({ ...containter }));
      }
    } else { // 点击图形本身
      if (downinfo instanceof Rect) {
        this.backOperation.push(new Rect({ ...downinfo }));
      }
      if (downinfo instanceof ImageRect) {
        this.backOperation.push(new ImageRect({ ...downinfo }));
      }
    }
  }

  onmousedown(e: MouseEvent) {
    const point = { x: e.offsetX, y: e.offsetY };
    const currentDown: any = ([...this.hornList, ...this.rectList, ...this.imageList].find((ele: imageProps | RectProps | HornProps) => {
      const w = ele instanceof Horn ? this.hornW : ele.width ;
      const h = ele instanceof Horn ? this.hornW : ele.height;
      const shape = {
        width: w,
        height: h,
        radian: ele.radian ?? 0,
        position : { x: ele.x + w / 2, y: ele.y + h / 2 }
      };
      if (ele instanceof Horn && (this.currentContainter instanceof Rect || this.currentContainter instanceof ImageRect) && ele.radian) {
        const radianCenter = { x: this.currentContainter.x + this.currentContainter.width / 2, y: this.currentContainter.y + this.currentContainter.height / 2 };
        return this.isPosInRotationRect(point, shape, radianCenter) && !ele.cancel;
      }
      if (ele instanceof Horn) {
        return this.isPosInRotationRect(point, shape) && !ele.cancel;
      }
      return this.isPosInRotationRect(point, shape);
    }));
    this.currentShape = currentDown;
    if (!currentDown) {
      this.paintRect();
      this.paintImage();
      this.paintHorn(this.currentContainter || {}, true);
      return;
    }

    const isHorn = this.currentShape instanceof Horn;
    if (!isHorn) {
      const hornProps = {
        x: this.currentShape.x,
        y: this.currentShape.y,
        height: this.currentShape.height,
        width: this.currentShape.width,
        radian: this.currentShape.radian,
      };
      this.paintRect();
      this.paintImage();
      this.paintHorn(hornProps);
      this.currentContainter = this.currentShape;
    }
    this.Operations(currentDown, this.currentContainter, isHorn);

    this.currentShape.mousedown(e);
  }

  mousemove(e: MouseEvent) {
    let cursor = 'default';
    const point = { x: e.offsetX, y: e.offsetY };
    ([...this.rectList, ...this.imageList, ...this.hornList].forEach((ele) => {
      const w = ele instanceof Horn ? this.hornW : ele.width ;
      const h = ele instanceof Horn ? this.hornW : ele.height;
      const shape = {
        width: w,
        height: h,
        radian: ele.radian ?? 0,
        position : { x: ele.x + w / 2, y: ele.y + h / 2 }};
        let radianCenter;
        if (ele instanceof Horn && (this.currentContainter instanceof Rect || this.currentContainter instanceof ImageRect) && ele.radian) {
          radianCenter = { x: this.currentContainter.x + this.currentContainter.width / 2, y: this.currentContainter.y + this.currentContainter.height / 2 };
        }
      if (this.isPosInRotationRect(point, shape, radianCenter)) {
        const IsRect = ele instanceof Rect || ele instanceof ImageRect;
        const isHorn = ele instanceof Horn;
        if (IsRect) {
          cursor = 'move';
        }
        if (isHorn && !ele.cancel) {
          cursor = ele.cursor;
        }
      }
    }));
    this.canvas.style.cursor = cursor;
  }

};


class Rect { // 矩形
  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public color: string;
  public Canvas?: DragCanvas;
  public radian?: number; // 旋转的弧度
  public uuid?: string
  constructor ({ width, height, x, y, color, Canvas, radian = 0, uuid }: RectProps) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.Canvas = Canvas;
    this.radian = radian;
    this.uuid = uuid;
  }

  mousedown(e: MouseEvent) {
    const disX = e.pageX - this.x;
    const disY = e.pageY - this.y;
    document.onmousemove = (mouseEvent) => {
      this.x = mouseEvent.pageX - disX;
      this.y = mouseEvent.pageY - disY;
      this.Canvas?.paintRect();
      this.Canvas?.paintImage();
      this.Canvas?.paintHorn({ x: this.x, y: this.y, width: this.width, height: this.height, radian: this.radian ?? 0 });
    }
    document.onmouseup = () => {
      document.onmousemove = document.onmousedown = null
    }
  }
}

class ImageRect { // 图片
  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public Canvas?: DragCanvas;
  public img: HTMLImageElement; // 图像
  public radian?: number; // 旋转的弧度
  public uuid?: string;
  constructor ({ width, height, x, y,  Canvas, img, radian = 0, uuid }: imageProps) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.Canvas = Canvas;
    this.img = img;
    this.radian = radian;
    this.uuid = uuid;
  }

  mousedown(e: MouseEvent) {
    const disX = e.pageX - this.x;
    const disY = e.pageY - this.y;
    document.onmousemove = (mouseEvent) => {
      this.x = mouseEvent.pageX - disX;
      this.y = mouseEvent.pageY - disY;
      this.Canvas?.paintRect();
      this.Canvas?.paintImage();
      this.Canvas?.paintHorn({ x: this.x, y: this.y, width: this.width, height: this.height, radian: this.radian ?? 0 });
    }
    document.onmouseup = () => {
      document.onmousemove = document.onmousedown = null
    }
  }
}


class Horn { // 四个顶角
  public x: number; // 顶角的x
  public y: number; // 顶角的y
  public width: number; // 容器的宽
  public height: number; // 容器的高
  public Canvas: DragCanvas;
  public direction: string;
  public cursor: string; // 鼠标样式
  public containterX: number; // 容器的x
  public containterY: number; // 容器的y
  public radian: number; // 容器的旋转弧度
  public cancel?: boolean; // 表示取消图形
  public color: string | CanvasGradient; // 矩形边框的颜色
  public x2?: number; // 旋转连接线的linetox
  public y2?: number; // 旋转连接线的linetoy
  constructor({
    x, y, width, height, Canvas, direction, cursor, containterY, containterX, radian = 0, color = 'red', cancel = false,
    x2 = 0, y2 = 0,
  }: HornProps) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.Canvas = Canvas;
    this.direction = direction;
    this.cursor = cursor;
    this.containterY = containterY;
    this.containterX = containterX;
    this.radian = radian;
    this.color = color;
    this.cancel = cancel;
    this.x2 = x2;
    this.y2 = y2;
    this.paint();
  }

  directionShape(list: RectProps[] | imageProps[], movex: number, movey: number) {
    let x = this.containterX;
    let y = this.containterY;
    let w = this.width;
    let h = this.height;
    let radian = this.radian;
    if (this.direction === 'rightBottom') {
      w = w + movex;
      h = h + movey;
    }
    if (this.direction === 'leftTop') {
      x = x + movex;
      y = y + movey;
      w = w - movex;
      h = h - movey;
    }
    if (this.direction === 'rightTop') {
      y = y + movey;
      w = w + movex;
      h = h - movey;
    }
    if (this.direction === 'leftBottom') {
      x = x + movex;
      w = w - movex;
      h = h + movey;
    }
    if (this.direction === 'topMiddle') {
      y = y + movey;
      h = h - movey;
    }
    if (this.direction === 'bottomMiddle') {
      h = h + movey;
    }
    if (this.direction === 'leftMiddle') {
      x = x + movex;
      w = w - movex;
    }
    if (this.direction === 'rightMiddle') {
     w = w + movex
    }

    if (this.direction === 'rotate') {
      radian = Math.atan2(movey, movex);
    }
    list.forEach((item) => {
      if (item === this.Canvas.currentContainter) {
        Object.assign(item, {
          x,
          y,
          width: w,
          height: h,
          radian,
        });
      }
    });
    this.Canvas.paintRect();
    this.Canvas.paintImage();
    this.Canvas.paintHorn({ x, y, width: w, height: h, radian, });
  }

  paint() {
    const hornW = !this.cancel ? this.Canvas.hornW : 0;
    this.Canvas.editCtx.beginPath();
    this.Canvas.editCtx.save();
    this.Canvas.editCtx.translate(this.containterX + this.width / 2, this.containterY + this.height / 2);
    this.Canvas.editCtx.rotate(this.radian);
    this.Canvas.editCtx.translate(-(this.containterX + this.width / 2), -(this.containterY + this.height / 2));
    this.Canvas.editCtx.strokeStyle = this.color;
    if (this.direction === 'rotateLine') { // 旋转的连接线
      this.Canvas.editCtx.moveTo(!this.cancel ? this.x : 0 , !this.cancel ? this.y : 0);
      this.Canvas.editCtx.lineTo(!this.cancel ? this.x2 || 0 : 0, !this.cancel ? this.y2 || 0 : 0);
    } else {
      this.Canvas.editCtx.rect(this.x, this.y, hornW, hornW);
    }
    this.Canvas.editCtx.stroke();
    this.Canvas.editCtx.restore();
  }

  mousedown(e: MouseEvent) {
    document.onmousemove = (mouseEvent) => {
      const movex =  mouseEvent.pageX - e.pageX;
      const movey = mouseEvent.pageY - e.pageY;
      const list = this.Canvas.currentContainter.img ?  this.Canvas.imageList : this.Canvas.rectList
      this.directionShape(list, movex, movey);
    }
    document.onmouseup = () => {
      document.onmousemove = document.onmousedown = null
    }
  }

}

export default DragCanvas;