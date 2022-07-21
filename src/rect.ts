import DragCanvas, { RectProps } from './canvas';

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
    if (this.Canvas) {
      document.onmousemove = (mouseEvent) => {
        this.x = mouseEvent.pageX - disX;
        this.y = mouseEvent.pageY - disY;
        const obj = { x: this.x, y: this.y, width: this.width, height: this.height, radian: this.radian ?? 0  };
        this.Canvas?.paintAll(obj);
      }
      this.Canvas.canvas.onmouseup = () => {
        this.Canvas?  this.Canvas.canvas.onmousemove = this.Canvas.canvas.onmousedown = null : null
      }
    }
  }
};

export default Rect;