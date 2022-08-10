import { uuid, isPosInRotationRect } from './utils';
import Horn from './horn';
import Line from './line';
import ImageRect from './image';
import Rect from './rect';
import CanvsText from './text';

export interface BaseHornProps {
  x: number;
  y: number;
  width: number;
  height: number;
  radian: number; // 容器的旋转弧度
}

class DragCanvas {
  public canvas: HTMLCanvasElement;

  public editCtx: CanvasRenderingContext2D;

  public rectList: Rect[]  = []; // 矩形列表

  public imageList: ImageRect[] = []; // 图片列表

  public hornList: Horn[] = []; // 顶角数据

  public lineList: Line[] = []; // 线列表存储

  public textList: CanvsText[] = []; // 文字列表存储

  public hornW = 16;

  protected currentShape: any; // 当前点击的图形（四个角或者图片图形）

  public currentContainter: any; // 当前图形的容器

  public backOperation: any = []; // 操作步骤存储list

  public paintColor: string = 'black';

  public lineWidth: number = 1;

  public ratio: number;
  
  constructor(canvas:HTMLCanvasElement) {
    this.ratio = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;
    this.canvas = canvas;
    canvas.width = w * this.ratio;
    canvas.height = h * this.ratio;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    this.editCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    const parent = document.createElement('div'); // 创建canvas的parent，以便于文字编辑input定位
    parent.setAttribute('style', `position: relative; width: ${canvas.style.width}; height: ${canvas.style.height}`);
    canvas.parentNode?.insertBefore(parent, canvas); // 把parent插入到canvas的位置
    parent.appendChild(canvas); // 再把canvas 放到 parent中
    canvas.style.position = 'absolute';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    this.editCtx.scale(this.ratio, this.ratio); // window.devicePixelRatio 解决图片文案不清晰
    this.init();
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }

  init() {
    this.canvas.addEventListener('mousedown', this.onmousedown.bind(this));
    this.canvas.addEventListener('mousemove', this.mousemove.bind(this));
  }

  add(options: ImageRect | Rect | Line | CanvsText) {
    const id = uuid();
    options.Canvas = this;
    options.uuid = id;
    options.paint();
    if (options instanceof ImageRect) {
      this.imageList.push(options);
    }
    if (options instanceof Rect) {
      this.rectList.push(options);
    }
    if (options instanceof Line) {
      this.lineList.push(options);
    }
    if (options instanceof CanvsText) {
      this.textList.push(options);
    }
  }

  remove(options: ImageRect | Rect | Line | CanvsText) {
    const list = [...this.rectList, ...this.imageList, ...this.lineList, ...this.textList];
    const temList = list.filter((item) => {
      if (item.uuid === options.uuid) {
        options.delete();
      }
      return item.uuid !== options.uuid;
    });
    this.imageList = temList.filter((item) => item instanceof ImageRect) as ImageRect[];
    this.lineList = temList.filter((item) => item instanceof Line) as Line[];
    this.rectList = temList.filter((item) => item instanceof Rect) as Rect[];
    this.textList = temList.filter((item) => item instanceof CanvsText) as CanvsText[];
    this.paintAll(this.currentContainter, true);
  }

  clear() {
    this.editCtx.clearRect(0, 0, this.width, this.height);
  }

  back(step: number = 1) { // 回退
    const stepIndex = step > this.backOperation.length ? 0 : this.backOperation.length - step;
    const lastOperation = this.backOperation[stepIndex]; // 回退到这一步
    const temOperation = this.backOperation.slice(0, stepIndex); // 回退后操作列表的缓存
    const list = lastOperation instanceof ImageRect ? this.imageList : lastOperation instanceof Rect ? this.rectList : [];
    if (lastOperation instanceof CanvsText) { // 文字的回退
      if (temOperation.some((i: any) => i.uuid === lastOperation?.uuid)) { // 如果操作步骤中含有要lastOperation操作则更新文字，否则在列表中删除这条文案
        this.textList.forEach((item) => {
          if (item?.uuid === lastOperation?.uuid) {
            Object.assign(item, {
              ...lastOperation,
            });
          }
        });
      } else {
        this.textList = this.textList.filter((i: CanvsText) => {
          if (i.uuid === lastOperation.uuid) {
            i.delete();
          }
          return i.uuid !== lastOperation?.uuid
        });
      }
    } else { // 图片，矩形的回退
      list.forEach((item) => {
        if (item?.uuid === lastOperation?.uuid) {
          Object.assign(item, {
            ...lastOperation,
          });
        }
      });
    }

    if (this.backOperation.length) {
      const cancel = lastOperation instanceof CanvsText || this.currentContainter instanceof CanvsText;
      this.paintAll(this.currentContainter, cancel);
    }

    this.backOperation = temOperation;
  }

  paintHorn(option: BaseHornProps, cancel: boolean = false) { // cancel为true表示没有点击到图形上，清除horn
    const { x, y, width: w, height: h, radian } = option;
    const intersectionW = this.hornW / 2;
    const basehorn = {
      radian,
      Canvas: this,
      width: w,
      height: h,
      containterX: x,
      containterY: y,
      cancel,
      color: 'red',
    };

    const hornList: Horn[] = [
      new Horn({ direction: 'rightTop',  x: x - intersectionW + w, y: y - intersectionW, cursor: 'nesw-resize', ...basehorn }),
      new Horn({ direction: 'leftTop', x: x - intersectionW, y: y - intersectionW, cursor: 'nwse-resize', ...basehorn }),
      new Horn({ direction: 'leftBottom', x: x - intersectionW, y: y - intersectionW + h, cursor: 'nesw-resize', ...basehorn }),
      new Horn({ direction: 'rightBottom', x: x - intersectionW + w, y: y - intersectionW + h, cursor: 'nwse-resize', ...basehorn }),
      new Horn({ direction: 'topMiddle', x: x + w / 2 - intersectionW, y: y - intersectionW, cursor: 'ns-resize', ...basehorn }),
      new Horn({ direction: 'leftMiddle', x: x - intersectionW, y: y + h / 2 - intersectionW, cursor: 'ew-resize', ...basehorn }),
      new Horn({ direction: 'rightMiddle', x: x + w - intersectionW, y: y + h / 2 - intersectionW, cursor: 'ew-resize', ...basehorn}),
      new Horn({ direction: 'bottomMiddle', x: x + w / 2 - intersectionW, y: y + h - intersectionW, cursor: 'ns-resize', ...basehorn }),
      new Horn({ direction: 'rotate', x: x + w / 2 - intersectionW, y: y - intersectionW - 40, cursor: 'crosshair', ...basehorn }),
      new Horn({ direction: 'rotateLine', x: x + w / 2, y: y - 40 + intersectionW, x2:  x + w / 2, y2: y - intersectionW, cursor: 'default ', ...basehorn }),
    ];

    this.hornList = hornList;
  }

  paintAll(option: BaseHornProps, cancel: boolean = false) {
    this.editCtx.clearRect(0, 0, this.width, this.height);
    let list: any[] = [...this.lineList, ...this.imageList, ...this.textList, ...this.rectList, ];
    if (this.currentContainter instanceof ImageRect) {
      list = [...this.lineList, ...this.textList, ...this.rectList, ...this.imageList];
    } else if (this.currentContainter instanceof Rect) {
      list = [...this.lineList, ...this.textList, ...this.imageList, ...this.rectList];
    }
    list.forEach((item) => {
      item instanceof ImageRect ? item.paintImage() : item.paint();
    });
    if (option) {
      this.paintHorn(option, cancel);
    }
  }

  Operations(downinfo: any, containter: any, ishorn: boolean) { // 存贮前一步操作
    if (ishorn) { // 点击四个顶角旋转角
      if (containter instanceof Rect) {
        this.backOperation.push(new Rect({ ...containter }));
      }
      if (containter instanceof ImageRect) {
        this.backOperation.push(new ImageRect({ ...containter }));
      }
    } else { // 点击图形本身
      if (downinfo instanceof Rect) {
        this.backOperation.push(new Rect({ ...downinfo }));
      }
      if (downinfo instanceof ImageRect) {
        this.backOperation.push(new ImageRect({ ...downinfo }));
      }
      if (downinfo instanceof CanvsText) {
        this.backOperation.push(new CanvsText({ ...downinfo }));
      }
    }
  }

  mouseJudge(e: MouseEvent, type: 'down' | 'move') {
    let cursor = 'default';
    const point = {  x: e.offsetX, y: e.offsetY };
    const currentDown: any = ([...this.hornList, ...this.rectList, ...this.imageList, ...this.textList].find((ele: ImageRect | Rect | Horn | CanvsText) => {
      const w = ele instanceof Horn ? this.hornW : ele.width ?? 0;
      const h = ele instanceof Horn ? this.hornW : ele.height ?? 0;
      const shape = {
        width: w,
        height: h,
        radian: ele.radian ?? 0,
        position : { x: (ele.x || 0) + w / 2, y: (ele.y || 0) + h / 2 }
      };
      let radianCenter;
      if (ele instanceof Horn && (this.currentContainter instanceof Rect || this.currentContainter instanceof ImageRect) && ele.radian) {
        radianCenter = { x: this.currentContainter.x + this.currentContainter.width / 2, y: this.currentContainter.y + this.currentContainter.height / 2 };
      }
      if (ele instanceof Horn) {
        return ele.isOperation && isPosInRotationRect(point, shape, radianCenter) && !ele.cancel;
      }
      return ele.isOperation && isPosInRotationRect(point, shape);
    }));

    if (currentDown && type === 'move' && currentDown.isOperation) {
      const IsRect = currentDown instanceof Rect || currentDown instanceof ImageRect;
      const isHorn = currentDown instanceof Horn;
      if (IsRect) {
        cursor = 'move';
      }
      if (currentDown instanceof CanvsText) {
        cursor = 'move';
      }
      if (isHorn && !currentDown.cancel) {
        cursor = currentDown.cursor;
      }
    }
    return type === 'move' ? cursor : currentDown;
  }

  onmousedown(e: MouseEvent) {
    const currentDown = this.mouseJudge(e, 'down');
    this.currentShape = currentDown;
    if (!currentDown) {
      this.hornList.length > 0 && this.paintAll(this.currentContainter || {}, true); // 删除horn
      return;
    }
    const isHorn = this.currentShape instanceof Horn;
    if (!isHorn) {
      const hornProps = {
        x: this.currentShape.x,
        y: this.currentShape.y,
        height: this.currentShape.height,
        width: this.currentShape.width,
        radian: this.currentShape.radian,
      };
      if (this.currentShape instanceof ImageRect) { // 为了使当前图形在最上层
        const list = this.imageList.filter((item) => item.uuid !== this.currentShape.uuid);
        list.push(this.currentShape);
        this.imageList = list;
      }
      if (this.currentShape instanceof Rect) { // 为了使当前图形在最上层
        const list = this.rectList.filter((item) => item.uuid !== this.currentShape.uuid);
        list.push(this.currentShape);
        this.rectList = list;
      }
      this.paintAll(hornProps, this.currentShape instanceof CanvsText);
      this.currentContainter = this.currentShape;
    }
    this.Operations(currentDown, this.currentContainter, isHorn);
    this.currentShape.mousedown(e);
  }

  mousemove(e: MouseEvent) {
    this.canvas.style.cursor = this.mouseJudge(e, 'move');
  }

};

export default DragCanvas;