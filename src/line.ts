import DragCanvas from './canvas'
export interface LineProps {
  Canvas: DragCanvas;
  paintColor: string;
  lineWidth?: number;
}

class Line {
  public Canvas: DragCanvas;
  public paintColor: string;
  public lineWidth?: number;
  constructor({ Canvas, paintColor, lineWidth }: LineProps) {
    this.Canvas = Canvas;
    this.paintColor = paintColor;
    this.lineWidth = lineWidth;
  }
  mousedown(e: MouseEvent) {
    this.Canvas.editCtx.lineWidth = this.lineWidth || 1
    this.Canvas.editCtx.strokeStyle = this.paintColor;
    this.Canvas.editCtx.save();
    const line = new Path2D();
    this.Canvas.editCtx.beginPath();
    this.Canvas.editCtx.lineWidth = this.lineWidth || 1
    this.Canvas.editCtx.strokeStyle = this.paintColor;
    line.moveTo(e.offsetX, e.offsetY);
    this.Canvas.canvas.onmousemove = (evt) => {
      line.lineTo(evt.offsetX, evt.offsetY);
      this.Canvas.editCtx.stroke(line);
    }
    this.Canvas.canvas.onmouseup = () => {
      this.Canvas.editCtx.closePath();
      this.Canvas.editCtx.restore();
      this.Canvas.paintStart = false;
      this.Canvas.canvas.onmousemove = this.Canvas.canvas.onmousedown =  null;
      this.Canvas.lineList.push(line);
      this.Canvas.backOperation.push(line);
    }
  }
}

export default Line;