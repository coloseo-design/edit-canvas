import { Graphics, Text } from 'pixi.js';



class ScaleLine {
  width: number;
  topContainer: any;
  topContainer1: any;
  leftContainer: any;
  // public boundary: number = 135000;
  public boundary: number = 20000;
  public gap: number;
  public lines: any;
  constructor({ width = 0, gap = 50 }: any) {
    this.gap = 50;
    const topContainer = new Graphics();
    topContainer.beginFill(0xffffff);
    topContainer.lineStyle(1, 0xA6A8A9);
    topContainer.drawRect(
      -this.boundary,
      0,
      this.boundary * 2,
      30
    );
    topContainer.endFill();


    this.width = width;
    this.topContainer = topContainer;
    const leftContainer = new Graphics();
    leftContainer.beginFill(0xffffff);
    leftContainer.lineStyle(1, 0xA6A8A9);
    leftContainer.drawRect(0, -this.boundary, 30, this.boundary * 2);
    leftContainer.beginFill();
    this.leftContainer = leftContainer;
    this.lines = new Graphics();
    this.paint(50, true);
    this.paint1();
  }
  paintLine(move: any, end: any) {
    const line = new Graphics();
    line.lineStyle(1, 0xA6A8A9, 1);
    line.clear();
    line.lineStyle(1, 0xA6A8A9, 1);
    line.moveTo(move.start, move.end);
    line.lineTo(end.start, end.end);
    this.lines.addChild(line);
  }
  paintText(txt: string, x: number, y: number, negative: boolean = false) {
    const text = new Text(txt, {
      fill: 0xA6A8A9,
      fontSize: 10,
    });
    let tx = x - text.width / 2
    if (negative) {
      tx = -(x + text.width / 2);
    }
    text.position.set(tx, y);
    this.lines.addChild(text);;
  }

  test(x: number, width: number, gap: number = 50) {
    this.lines.children = [];
    this.topContainer.removeChild(this.lines);
    const tx = Math.floor(x);
    const list = Array.from({ length: Math.ceil(width / gap) }).map((_, k) => k);
    const tem: any = [];
    list.forEach((item) => {
      tem.push(tx + item * gap);
      this.paintText(`${tx + item * gap}`, tx + item * gap, 10);
      this.paintLine({ start: tx + item * gap, end: 25 }, { start: tx + item * gap, end: 30 });
    });
    this.topContainer.addChild(this.lines);
  }

  paint(gap = 50, init: boolean = false) {
    if (init || (this.gap !== gap)) {
      this.gap = gap;
      this.lines.children = [];
      this.topContainer.removeChild(this.lines);
      Array.from({ length: Math.ceil(this.boundary / gap) }).forEach((_, key) => {
        const move = {
          start: key * gap,
          end: 25
        }
        const to = {
          start: key * gap,
          end: 30
        }
        this.paintLine(move, to);
        this.paintText(`${key * gap}`, key * gap, 10);
      });
      Array.from({ length: Math.ceil(this.boundary / gap) }).forEach((_, key) => {
        this.paintText(`-${(key + 1) * gap}`, (key + 1) * gap, 10, true);
        this.paintLine({ start: -(key + 1) * gap, end: 25 }, { start: -(key + 1) * gap, end: 30 });
      });
      this.topContainer.addChild(this.lines);
    }
  }

  paint1(gap = 50) {
    Array.from({ length: Math.ceil(this.boundary / gap) }).forEach((_, key) => {
      const line = new Graphics();
      const text = new Text(`${(key) * gap}`, {
        fill: 0xA6A8A9,
        fontSize: 10,
      });
      text.position.set(20, key * gap - (text.width / 2));
      text.rotation = Math.PI / 2;
      line.clear();
      line.lineStyle(1, 0xA6A8A9, 1);
      line.moveTo(25, key * gap);
      line.lineTo(30, key * gap);
      this.leftContainer.addChild(line);
      this.leftContainer.addChild(text);
    });
    Array.from({ length: Math.ceil(this.boundary / gap) }).forEach((_, key) => {
      const line = new Graphics();
      const text = new Text(`-${(key + 1) * gap}`, {
        fill: 0xA6A8A9,
        fontSize: 10,
      });
      text.position.set(20, -((key + 1) * gap + (text.width / 2)));
      text.rotation = Math.PI / 2;
      line.clear();
      line.lineStyle(1, 0xA6A8A9, 1);
      line.moveTo(25, -(key + 1) * gap);
      line.lineTo(30, -(key + 1) * gap);
      this.leftContainer.addChild(line);
      this.leftContainer.addChild(text);
    });
  }
};

export default ScaleLine;