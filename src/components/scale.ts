import { Graphics, Text } from 'pixi.js';
import CanvasStore from './store';
import { uuid } from './utils';



class ScaleLine {
  topContainer: any;
  topContainer1: any;
  leftContainer: any;
  public boundary: number = 135000;
  public gap: number;
  public countX: number = 1;
  public countY: number = 1;
  private scrollList: any;
  public swipeList: any[] = [];
  public verticalSwipes: any[] = [];
  private verticalScroll: any;
  constructor({ gap = 100 }: any) {
    this.gap = gap;
    this.topContainer = this.paintContainer(-this.boundary, 0, this.boundary * 2, 30);
    this.leftContainer = this.paintContainer(0, -this.boundary, 30, this.boundary * 2);
    this.countX = Math.ceil(CanvasStore.screen.width / gap);
    this.countY = Math.ceil(CanvasStore.screen.height / gap);
    this.swipeList = [];
    this.scrollList = new Graphics();
    this.verticalScroll = new Graphics();
    this.paintX();
    this.paintY();
  }
  paintContainer(x: number, y: number, width: number, height: number) {
    const container = new Graphics();
    container.beginFill(0xffffff);
    container.lineStyle(1, 0xA6A8A9);
    container.drawRect(
      x,
      y,
      width,
      height,
    );
    container.endFill();
    return container;
  }
  paint(start: number, isVertical: boolean = false, gap: number = 100) {
    const mid: any = [];
    const prefix: any = [];
    const suffix: any[] = [];
    const temList: any[] = [];
    const count = isVertical ? this.countY : this.countX;
    const suffixStart = (count - 1) * gap + start;
    Array.from({ length: count }).forEach((_, key) => {
      const uid = `${uuid()}`;
      const dm = key * gap + start; // 当前位置
      const ds = suffixStart + (key + 1) * gap; // 后一屏位置
      const dp = start - (count - key) * gap; // 前一屏位置

      this.write(dm , temList, uid, mid, isVertical);
      this.write(ds, temList, uid, suffix, isVertical);
      this.write(dp, temList, uid, prefix, isVertical);
    });
    if (isVertical) {
      this.verticalSwipes = [prefix, mid, suffix];
      this.verticalScroll.children = temList;
      this.leftContainer.addChild(this.verticalScroll);
    } else {
      this.swipeList = [prefix, mid, suffix];
      this.scrollList.children = temList;
      this.topContainer.addChild(this.scrollList);
    }
  }
  paintX(start: number = 0, gap: number = 100) {
    this.paint(start, false, gap);
  }

  paintY(start: number = 0, gap: number = 100) {
    this.paint(start, true, gap);
  }

  write(distance: number, temList: any = [], uid: string, list: any = [], isVertical: boolean = false) {
    const { x } = CanvasStore.scale;
    const d = Math.ceil(distance * x);
    const tx = isVertical ? 20 : d;
    const ty = isVertical ? d : 10;
    const txt: any = this.text(`${distance}`, tx, ty, isVertical);
    txt.uuid = uid;
    const linM = {
      x: isVertical ? 25 : d,
      y: isVertical ? d : 25,
    }
    const lineT = {
      x: isVertical ? 30 : d,
      y: isVertical ? d : 30,
    }
    const line: any = this.line(linM, lineT);
    line.uuid = uid;
    if (isVertical) {
      this.verticalScroll.addChild(line);
      this.verticalScroll.addChild(txt);
    } else {
      this.scrollList.addChild(line);
      this.scrollList.addChild(txt);
    }
    list.push({ start: distance, uid });
    temList.push(...[txt, line]);
  }
  line(move: any, end: any) {
    const line = new Graphics();
    line.lineStyle(1, 0xA6A8A9, 1);
    line.clear();
    line.lineStyle(1, 0xA6A8A9, 1);
    line.moveTo(move.x, move.y);
    line.lineTo(end.x, end.y);
    return line;
  }
  text(txt: string, x: number, y: number, isVertical: boolean) {
    const text = new Text(txt, {
      fill: 0xA6A8A9,
      fontSize: 10,
    });
    const tx = isVertical ? x : x - text.width / 2;
    const ty = isVertical ? y - text.width / 2 : y;
    if (isVertical) {
      text.rotation = Math.PI / 2;
    }
    text.position.set(tx, ty);
    return text;
  }
};

export default ScaleLine;