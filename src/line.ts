import DragCanvas from './canvas'
export interface LineProps {
  Canvas?: DragCanvas;
  color?: string;
  lineWidth?: number;
  uuid?: string;
}

class Line {
  public Canvas?: DragCanvas;
  public color?: string;
  public lineWidth?: number;
  public uuid?: string;

  public line?: Path2D | null;
  constructor({ Canvas, color = 'black', lineWidth = 1, uuid }: LineProps) {
    this.Canvas = Canvas;
    this.color = color;
    this.lineWidth = lineWidth;
    this.uuid = uuid;
    this.line = new Path2D();
  }

  paint() {
    this.line && this.Canvas?.editCtx.stroke(this.line);
  }

  delete() {
    this.line = null;
  }

  paintBrush() {
    if (this.Canvas) {
      const { canvas } = this.Canvas;
      canvas.onmousedown = (e) => {
        this.mousedown(e);
      }
    }
  }
  mousedown(e: MouseEvent) {
    if (this.Canvas && this.line) {
      const { editCtx,  canvas } = this.Canvas;
      editCtx.lineWidth = this.lineWidth || 1
      editCtx.strokeStyle = this.color || 'black';
      editCtx.save();
      editCtx.beginPath();
      editCtx.lineWidth = this.lineWidth || 1
      editCtx.strokeStyle = this.color || 'black';
      this.line.moveTo(e.offsetX, e.offsetY);
      canvas.onmousemove = (evt) => {
        this.line && this.line.lineTo(evt.offsetX, evt.offsetY);
        this.line && editCtx.stroke(this.line);
      }
      canvas.onmouseup = () => {
        editCtx.closePath();
        editCtx.restore();
        canvas.onmousemove = canvas.onmousedown =  null;
        this.line && this.Canvas?.lineList.push(this);
        this.line && this.Canvas?.backOperation.push(this);
      }
    }
  }
}

export default Line;