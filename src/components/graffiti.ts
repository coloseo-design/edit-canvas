import { Graphics, InteractionEvent } from 'pixi.js';
import { uuid } from './utils';
import { positionType } from './canvas';
import { getPoint, getBoundRect } from './utils';
import CanvasStore from './store';


type GraffitiType = {
  color?: number,
  lineWidth?: number,
  alpha?: number,
}

class Graffiti {
  public brush: any;
  public color: number;
  public lineWidth: number;
  public children: Graffiti[] = [];
  public uuid: string;
  app: any;
  operate: any;
  container: any;
  alpha: number;
  constructor(props?: GraffitiType) {
    const { color = 0x6078F4, lineWidth = 10, alpha = 0.7 } = props || {};
    const brush = new Graphics();
    this.brush = brush;
    this.color = color;
    this.brush.repeat = this.repeat;
    this.lineWidth = lineWidth;
    this.brush.delete = this.delete;
    this.brush.paint = this.paint;
    this.alpha = alpha;
    this.uuid = `${uuid()}`;
    this.brush.on('pointerdown', this.down);
    this.brush.on('pointerup', this.up);
  }

  paint = (e: InteractionEvent) => {
    const scalePosition = getPoint(e);
    this.brush.beginFill(this.color, this.alpha);
    this.brush.isDrag = false;
    this.brush.drawCircle(scalePosition.x, scalePosition.y, this.lineWidth);
    this.brush.endFill();

  }

  public setStyle({ color, alpha, lineWidth }: GraffitiType) {
    if (color) {
      this.color = color;
    }
    if (lineWidth) {
      this.lineWidth = lineWidth;
    }
    if (alpha) {
      this.alpha = alpha;
    }
  }

  public delete = () => {
    this.container?.removeChild(this.brush)
    this.operate?.clear?.();
  }

  private repeat = (rect: positionType & { width: number, height: number }) => {
    this.brush.beginFill(this.app.app?.renderer.backgroundColor, 0.1);
    this.brush.drawRect(rect.x, rect.y, rect.width, rect.height);
    this.brush.endFill();
  }


  down = (e: InteractionEvent) => { // TODO
    e.stopPropagation();
    if (!this.app.isGraffiti) {
      this.brush.isDrag = true;
      this.move(getPoint(e));
    }


  }
  move = (start: positionType) => {
    this.brush.on('pointermove', (e: InteractionEvent) => {
      if (this.brush.isDrag) {
        const scalePosition = getPoint(e);
        const x = (scalePosition.x - start.x) / CanvasStore.scale.x;
        const y = (scalePosition.y - start.y)/ CanvasStore.scale.x;
        this.brush.position.set(x, y);
        this.operate.clear();
      }
    });
  }

  up = () => {
    if (this.brush.isDrag) {
      this.brush.isDrag = false;
    }
  }
};

export default Graffiti;