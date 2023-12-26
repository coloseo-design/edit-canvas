import { Graphics, Text } from 'pixi.js';
class SelectorTool {
  private pixiApp: any;
  private p1: any;
  private p2: any;
  private rect: any;
  constructor(pixiApp: any, startPoint: any) {
    this.pixiApp = pixiApp;
    this.p1 = startPoint;
    this.p2 = startPoint;
    this.rect = new Graphics();
    this.pixiApp.addChild(this.rect);
    this.rect.name = 'select';
  }
  getRect(): any {
    const xMin = Math.min(this.p1.x, this.p2.x);
    const yMin = Math.min(this.p1.y, this.p2.y);
    const xMax = Math.max(this.p1.x, this.p2.x);
    const yMax = Math.max(this.p1.y, this.p2.y);
    return {
      tl: {x: xMin, y: yMin },
      br: {x: xMax, y: yMax },
    };
  }
  drawRect() {
    const rect = this.getRect();
    this.rect.clear();
    this.rect.beginFill(0x8888ff, 0.5);
    this.rect.drawRect(
      rect.tl.x,
      rect.tl.y,
      rect.br.x - rect.tl.x,
      rect.br.y - rect.tl.y
    );
    this.rect.endFill();
  }
  move(point: any) {
    this.p2 = point;
    this.drawRect();
  }
  end() {
    const selected: any[] = [];
    (this.pixiApp.children || []).filter((child: any) => {
      if (!['leftTop', 'leftBottom', 'rightTop', 'rightBottom', 'main', 'select'].includes(child.name)) {
        return true;
      }
   }).forEach((child: any) => {
    const { x, y, width: w, height: h } = this.rect.getBounds();
    const { x: x1, y: y1, width: w1, height: h1 } = child.getBounds();
    if (x1 >= x && y1 >= y && x1 + w1 <= x + w && y1 + h1 <= y + h) {
      selected.push(child);
    }
   });
   return selected;
  }
};

export default SelectorTool;