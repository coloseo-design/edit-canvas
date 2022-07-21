import DragCanvas from './canvas'
export interface LineProps {
  Canvas: DragCanvas;
  paintColor: string;
}

class Line {
  public Canvas: DragCanvas;
  public paintColor: string;

  constructor({ Canvas, paintColor }: LineProps) {
    this.Canvas = Canvas;
    this.paintColor = paintColor;
  }
  mousedown(e: MouseEvent) {
    const line = new Path2D();
    this.Canvas.editCtx.beginPath();
    this.Canvas.editCtx.strokeStyle = this.paintColor;
    line.moveTo(e.offsetX, e.offsetY);
    this.Canvas.canvas.onmousemove = (evt) => {
      line.lineTo(evt.offsetX, evt.offsetY);
      this.Canvas.editCtx.stroke(line);
    }
    this.Canvas.canvas.onmouseup = () => {
      this.Canvas.editCtx.closePath();
      this.Canvas.paintStart = false;
      this.Canvas.canvas.onmousemove = this.Canvas.canvas.onmousedown =  null;
      this.Canvas.lineList.push(line);
      this.Canvas.backOperation.push(line);
    }
  }
}

export default Line;