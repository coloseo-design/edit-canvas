import { uuid, isPosInRotationRect, sortShape } from './utils';
import Horn from './horn';
import Line from './line';
import ImageRect from './image';
import Rect from './rect';
import CanvasText from './text';

export interface BaseHornProps {
  x: number;
  y: number;
  width: number;
  height: number;
  radian: number; // 容器的旋转弧度
}

export type ShapeType = Rect | ImageRect | Line | CanvasText;

export type OmitShapeType = Rect | ImageRect | CanvasText;

class DragCanvas {
  public canvas: HTMLCanvasElement;

  public editCtx: CanvasRenderingContext2D;

  public hornList: Horn[] = []; // 顶角数据

  public hornW = 16;

  public shapeList: ShapeType[] = [] // 图形列表存贮;

  protected currentShape: any; // 当前点击的图形（四个角或者图片图形）

  public currentContainter: any; // 当前图形的容器

  public backOperation: ShapeType[] = []; // 操作步骤存储list

  public paintColor: string = 'black';

  public lineWidth: number = 1;

  public ratio: number;

  public leftGap: number = 0;

  public topGap: number = 0;
  
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
    parent.setAttribute('style', `position: relative; min-width: ${canvas.style.width}; min-height: ${canvas.style.height}`);
    canvas.parentNode?.insertBefore(parent, canvas); // 把parent插入到canvas的位置
    parent.appendChild(canvas); // 再把canvas 放到 parent中
    const { left: canvasLeft, top: canvasTop } = canvas.getBoundingClientRect();
    const { left: parentLeft, top: parentTop } = parent.getBoundingClientRect();
    this.leftGap = canvasLeft - parentLeft; // canvas到父级的left
    this.topGap = canvasTop - parentTop; // canvas到父级的top
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
    console.log('ttt', this.editCtx.measureText('呵呵呵134q'));
    this.canvas.addEventListener('mousedown', (e) => {
      this.onmousedown(e);
    });
    this.canvas.addEventListener('mousemove', (e) => {
      this.canvas.style.cursor = this.mouseJudge(e, 'move') as string;
    });
    this.canvas.addEventListener('dblclick', () => {
      if (this.currentShape instanceof CanvasText) {
        this.currentShape.writeText();
      }
    });
  }

  add(options: ShapeType) {
    options.Canvas = this;
    options.uuid = uuid();
    options.paint();
    options.level = this.shapeList.length;
    this.shapeList.push(options);
  }

  remove(options: ShapeType) {
    this.shapeList = this.shapeList.filter((item) => {
      if (item.uuid === options.uuid) options.delete();
      return item.uuid !== options.uuid;
    });
    this.paintAll(this.currentContainter, true);
  }

  clear() {
    this.editCtx.clearRect(0, 0, this.width, this.height);
  }

  back(step: number = 1) { // 回退
    const stepIndex = step > this.backOperation.length ? 0 : this.backOperation.length - step;
    const lastOperation = this.backOperation[stepIndex]; // 回退到这一步
    const temOperation = this.backOperation.slice(0, stepIndex); // 回退后操作列表的缓存
    this.shapeList.forEach((item) => { // TODO 文字回退
      if (item?.uuid === lastOperation?.uuid) {
        Object.assign(item, {
          ...lastOperation,
        });
      }
    });
    if (this.backOperation.length) {
      const cancel = lastOperation instanceof CanvasText || this.currentContainter instanceof CanvasText;
      this.paintAll(this.currentContainter, cancel);
    }
    this.backOperation = temOperation;
  }

  paintHorn(option: BaseHornProps, cancel: boolean = false) { // cancel为true表示没有点击到图形上，清除horn
    const { x: tX, y: tY, width: tW, height: tH, radian } = option;
    const intersectionW = this.hornW / 2;
    // 新增一个外边框用来拖拽拉伸， 不使用本来的container操作
    const x = tX - 20;
    const y = tY - 20;
    const w = tW + 40;
    const h = tH + 40;
    const baseHorn = {
      radian,
      Canvas: this,
      width: w,
      height: h,
      containterX: x,
      containterY: y,
      cancel,
      // color: 'red',
      color: 'blue',
    };

    const hornList: Horn[] = [
      new Horn({
        direction: 'rightTop', 
        x: x - intersectionW + w,
        y: y - intersectionW,
        cursor: 'nesw-resize',
        ...baseHorn,
      }),
      new Horn({
        direction: 'leftTop',
        x: x - intersectionW,
        y: y - intersectionW,
        cursor: 'nwse-resize',
        ...baseHorn,
      }),
      new Horn({
        direction: 'leftBottom',
        x: x - intersectionW,
        y: y - intersectionW + h,
        cursor: 'nesw-resize',
        ...baseHorn,
      }),
      new Horn({
        direction: 'rightBottom',
        x: x - intersectionW + w,
        y: y - intersectionW + h,
        cursor: 'nwse-resize',
        ...baseHorn,
      }),
      new Horn({
        direction: 'topMiddle',
        x: x + w / 2 - intersectionW,
        y: y - intersectionW,
        cursor: 'ns-resize',
        ...baseHorn,
      }),
      new Horn({
        direction: 'leftMiddle',
        x: x - intersectionW,
        y: y + h / 2 - intersectionW,
        cursor: 'ew-resize',
        ...baseHorn,
      }),
      new Horn({
        direction: 'rightMiddle',
        x: x + w - intersectionW,
        y: y + h / 2 - intersectionW,
        cursor: 'ew-resize',
        ...baseHorn
      }),
      new Horn({
        direction: 'bottomMiddle',
        x: x + w / 2 - intersectionW,
        y: y + h - intersectionW,
        cursor: 'ns-resize',
        ...baseHorn,
      }),
      new Horn({
        direction: 'rotate',
        x: x + w / 2 - intersectionW,
        y: y - intersectionW - 40,
        cursor: 'crosshair',
        ...baseHorn,
      }),
      new Horn({
        direction: 'rotateLine',
        x: x + w / 2,
        y: y - 40 + intersectionW,
        x2:  x + w / 2,
        y2: y - intersectionW,
        cursor: 'default ',
        ...baseHorn
      }),
      new Horn({ // 新增
        direction: 'container-rect',
        x: x,
        y: y,
        cursor: 'default ',
        ...baseHorn
      }),
    ];

    this.hornList = hornList;
  }

  paintAll(option: BaseHornProps, cancel: boolean = false) {
    this.editCtx.clearRect(0, 0, this.width, this.height); // 线清空画布再绘图
    this.shapeList.forEach((item) => {
      item instanceof ImageRect ? item.paintImage() : item.paint();
    });
    if (option) this.paintHorn(option, cancel);
  }

  Operations(downInfo: ShapeType | Horn, container: ShapeType, isHorn: boolean) { // 存贮前一步操作
    if (isHorn) { // 点击四个顶角旋转角
      if (container instanceof Rect) {
        this.backOperation.push(new Rect({ ...container }));
      }
      if (container instanceof ImageRect) {
        this.backOperation.push(new ImageRect({ ...container }));
      }
    } else { // 点击图形本身
      if (downInfo instanceof Rect) {
        this.backOperation.push(new Rect({ ...downInfo }));
      }
      if (downInfo instanceof ImageRect) {
        this.backOperation.push(new ImageRect({ ...downInfo }));
      }
      if (downInfo instanceof CanvasText) {
        this.backOperation.push(new CanvasText({ ...downInfo }));
      }
    }
  }

  mouseJudge(e: MouseEvent, type: 'down' | 'move') {
    let cursor = 'default';
    const point = {  x: e.offsetX, y: e.offsetY };
    const list = this.shapeList.filter((item) => !(item instanceof Line) && item.isOperation) as OmitShapeType[]; // line 和isOperation为false的不需要操作
    const currentDown: OmitShapeType | Horn | undefined = ([...this.hornList, ...list].find((ele: OmitShapeType | Horn) => {
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
        return isPosInRotationRect(point, shape, radianCenter) && !ele.cancel;
      }
      return isPosInRotationRect(point, shape);
    }));

    if (currentDown && type === 'move' && currentDown.isOperation) {
      const IsRect = currentDown instanceof Rect || currentDown instanceof ImageRect || currentDown instanceof CanvasText;
      const isHorn = currentDown instanceof Horn;
      if (IsRect) {
        cursor = 'move';
      }
      if (isHorn && !currentDown.cancel) {
        cursor = currentDown.cursor;
      }
    }
    return type === 'move' ? cursor : currentDown;
  }

  onmousedown(e: MouseEvent) {
    const currentDown = this.mouseJudge(e, 'down') as (ShapeType | Horn | undefined);
    this.currentShape = currentDown;
    console.log('==currentDown', currentDown);
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
      this.shapeList = sortShape(this.shapeList, this.currentShape); // 把当前图形的层级设为最高
      // this.paintAll(hornProps, this.currentShape instanceof CanvasText); // 在text上不画 拖拽拉伸操作
      this.paintAll(hornProps);
      this.currentContainter = this.currentShape;
    }
    this.Operations(currentDown, this.currentContainter, isHorn);
    this.currentShape.mousedown(e);
  }
};

export default DragCanvas;