import DragCanvas from './canvas';

interface pointType {
  x: number;
  y: number;
}
export interface LineProps {
  Canvas?: DragCanvas;
  color?: string;
  lineWidth?: number;
  uuid?: string;
  from: pointType;
  to: pointType;
  level?: number;
}

class Line {
  public Canvas?: DragCanvas;

  public color?: string;

  public lineWidth?: number;

  public uuid?: string;

  public from: pointType;

  public to: pointType;

  public level?: number; // 图形的层级

  constructor({ Canvas, color = 'black', lineWidth = 1, uuid, from, to, level = 1 }: LineProps) {
    this.Canvas = Canvas;
    this.color = color;
    this.lineWidth = lineWidth;
    this.uuid = uuid;
    this.from = from;
    this.to = to;

    this.level = level;
  }

  paint() {
    if (this.Canvas) {
      const { editCtx } = this.Canvas;
      editCtx.beginPath();
      editCtx.moveTo(this.from.x, this.from.y);
      editCtx.lineTo(this.to.x, this.to.y);
      editCtx.lineWidth = this.lineWidth || 1;
      editCtx.strokeStyle = this.color || 'black';
      editCtx.stroke();
      editCtx.closePath();
    }
  }

  delete() {
    if (this.Canvas) {
      const { editCtx } = this.Canvas;
      editCtx.beginPath();
      editCtx.lineWidth = 0;
      editCtx.stroke();
      editCtx.closePath();
    }
  }

  mousedown(e: MouseEvent) {
  }
}

export default Line;