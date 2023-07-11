import DragCanvas, { BaseHornProps } from './canvas';
import ImageRect from './image';
import Rect from './rect';
import CanvasText from './text';

export interface HornProps extends BaseHornProps {
  direction: string;
  cursor: string; // 鼠标样式
  containterX: number; // 容器的x
  containterY: number; // 容器的y
  cancel: boolean; // 表示取消图形
  color: string; // 矩形边框的颜色
  x2?: number; // 旋转连接线的linetox
  y2?: number; // 旋转连接线的linetoy
  Canvas: DragCanvas;
  isOperation?: boolean;
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

  public isOperation?: boolean;

  constructor({
    x, y, width, height, Canvas, direction, cursor, containterY, containterX, radian = 0, color = 'red', cancel = false,
    x2 = 0, y2 = 0,
    isOperation = true,
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
    this.isOperation = isOperation;
    this.paint();
  }

  directionShape(list: Rect[] | ImageRect[] | CanvasText[], moveX: number, moveY: number) {
    let x = this.containterX;
    let y = this.containterY;
    let w = this.width;
    let h = this.height;
    let radian = this.radian;
    if (this.direction === 'rightBottom') {
      w = w + moveX;
      h = h + moveY;
    }
    if (this.direction === 'leftTop') {
      x = x + moveX;
      y = y + moveY;
      w = w - moveX;
      h = h - moveY;
    }
    if (this.direction === 'rightTop') {
      y = y + moveY;
      w = w + moveX;
      h = h - moveY;
    }
    if (this.direction === 'leftBottom') {
      x = x + moveX;
      w = w - moveX;
      h = h + moveY;
    }
    if (this.direction === 'topMiddle') {
      y = y + moveY;
      h = h - moveY;
    }
    if (this.direction === 'bottomMiddle') {
      h = h + moveY;
    }
    if (this.direction === 'leftMiddle') {
      x = x + moveX;
      w = w - moveX;
    }
    if (this.direction === 'rightMiddle') {
     w = w + moveX
    }

    if (this.direction === 'rotate') {
      radian = Math.atan2(moveY, moveX);
    }
    list.forEach((item) => {
      if (item.uuid === this.Canvas.currentContainter.uuid) {
        Object.assign(item, {
          x,
          y,
          width: w,
          height: h,
          radian,
        });
      }
    });
    this.Canvas.paintAll({ x, y, width: w, height: h, radian, });
  }

  paint() {
    const hornW = !this.cancel ? this.Canvas.hornW : 0;
    this.Canvas.editCtx.beginPath();
    this.Canvas.editCtx.save();
    this.Canvas.editCtx.translate(this.containterX + this.width / 2, this.containterY + this.height / 2);
    this.Canvas.editCtx.rotate(this.radian);
    this.Canvas.editCtx.translate(-(this.containterX + this.width / 2), -(this.containterY + this.height / 2));
    this.Canvas.editCtx.strokeStyle = this.color;
    this.Canvas.editCtx.lineWidth = this.cancel ? 0 : 1;
    if (this.direction === 'rotateLine') { // 旋转的连接线
      this.Canvas.editCtx.moveTo(!this.cancel ? this.x : 0 , !this.cancel ? this.y : 0);
      this.Canvas.editCtx.lineTo(!this.cancel ? this.x2 || 0 : 0, !this.cancel ? this.y2 || 0 : 0);
    } else {
      const tw = this.direction === 'container-rect' ?(this.cancel ? 0 : this.width) : hornW;
      const ty = this.direction === 'container-rect' ? (this.cancel ? 0 : this.height) : hornW;
      this.Canvas.editCtx.rect(this.x, this.y, tw, ty);
    }
    this.Canvas.editCtx.stroke();
    this.Canvas.editCtx.restore();
  }

  mousedown(e: MouseEvent) {
    this.Canvas.canvas.onmousemove = (mouseEvent) => {
      const movex =  mouseEvent.pageX - e.pageX;
      const movey = mouseEvent.pageY - e.pageY;
      // const list = this.Canvas.shapeList.filter((item) => item instanceof ImageRect || item instanceof Rect) as (ImageRect[] | Rect[]);
      const list = this.Canvas.shapeList.filter((item) => item instanceof ImageRect || item instanceof Rect || item instanceof CanvasText) as (ImageRect[] | Rect[]| CanvasText[]);
      this.directionShape(list, movex, movey);
    }
    this.Canvas.canvas.onmouseup = () => {
      this.Canvas.canvas.onmousemove = this.Canvas.canvas.onmousedown = null
    }
  }

}

export default Horn;
