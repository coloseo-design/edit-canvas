import { uuid, Reverse, BackWhite, Relief, Grey, Red, isPosInRotationRect } from './utils';
import Horn from './horn';
import Line from './line';
import ImageRect from './image';
import Rect from './rect';
import CanvsText, { TextProps } from './text';

export interface BaseRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  Canvas?: DragCanvas;
  radian?: number;
  uuid?: string;
}

export interface imageProps extends BaseRectProps {
  img: HTMLImageElement;
  filter?: string;
  degree?: number;
}

export interface RectProps extends BaseRectProps {
  color: string;
}

export interface BaseHornProps {
  x: number;
  y: number;
  width: number;
  height: number;
  radian: number; // 容器的旋转弧度
}

interface TextTemProps {
  font: string;
  color?: string;
  Canvas?: DragCanvas;
  uuid?: string;
}

export interface HornProps extends BaseHornProps {
  direction: string;
  cursor: string; // 鼠标样式
  containterX: number; // 容器的x
  containterY: number; // 容器的y
  cancel: boolean; // 表示取消图形
  color: string; // 矩形边框的颜色
  x2?: number; // 旋转连接线的linetox
  y2?: number; // 旋转连接线的linetoy
  Canvas: DragCanvas;
}

interface paintBrushProps {
  color?: string;
  lineWidth?: number;
}

interface mapping {
  [x: string] : Function,
}
const FilterMap: mapping = {
  '反色': Reverse,
  '黑白':  BackWhite,
  '浮雕': Relief,
  '灰色': Grey,
  '单色': Red,
}



class DragCanvas {
  public canvas :HTMLCanvasElement;

  public editCtx:CanvasRenderingContext2D;

  public rectList: RectProps[]  = []; // 矩形列表

  public imageList: ImageRect[] = []; // 图片列表

  public hornList: HornProps[] = []; // 顶角数据

  public lineList: any = []; // 线列表存储

  public textList: CanvsText[] = []; // 文字列表存储

  public hornW = 16;

  protected currentShape: any; // 当前点击的图形（四个角或者图片图形）

  public currentContainter: any; // 当前图形的容器

  public backOperation: any = []; // 操作步骤存储list

  public paintStart: boolean = false; // 开始画

  public paintColor: string = 'black';

  public lineWidth: number = 1;

  public isEdit: boolean = false;

  public isWrite: boolean = false;

  public currentAddWrite: any = {};
  
  constructor(canvas:HTMLCanvasElement) {
    const ratio = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;
    this.canvas = canvas;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
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
    this.editCtx.scale(ratio, ratio); // window.devicePixelRatio 解决图片文案不清晰
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

  createRect(option: RectProps) {
    option.Canvas = this;
    option.uuid = uuid();
    this.rectList.push(new Rect(option));
    this.paintRect();
  }

  createImage(option: imageProps) {
    option.Canvas = this;
    option.uuid = uuid();
    const imgRect = new ImageRect(option);
    this.imageList.push(imgRect);
    this.paintImage(true);
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
    const rightTop = { direction: 'rightTop',  x: x - intersectionW + w, y: y - intersectionW, cursor: 'nesw-resize' };
    const leftTop = { direction: 'leftTop', x: x - intersectionW, y: y - intersectionW, cursor: 'nwse-resize' };
    const leftBottom = { direction: 'leftBottom', x: x - intersectionW, y: y - intersectionW + h, cursor: 'nesw-resize' };
    const rightBottom = { direction: 'rightBottom', x: x - intersectionW + w, y: y - intersectionW + h, cursor: 'nwse-resize' };
    const topMiddle = { direction : 'topMiddle', x: x + w / 2 - intersectionW, y: y - intersectionW, cursor: 'ns-resize' };
    const leftMiddle = { direction : 'leftMiddle', x: x - intersectionW, y: y + h / 2 - intersectionW, cursor: 'ew-resize' };
    const rightMiddle = { direction : 'rightMiddle', x: x + w - intersectionW, y: y + h / 2 - intersectionW, cursor: 'ew-resize' };
    const bottomMiddle = { direction : 'bottomMiddle', x: x + w / 2 - intersectionW, y: y + h - intersectionW, cursor: 'ns-resize' };
    const rotateRect = { direction : 'rotate', x: x + w / 2 - intersectionW, y: y - intersectionW - 40, cursor: 'crosshair' };
    const rotateLine = { direction: 'rotateLine', x: x + w / 2, y: y - 40 + intersectionW, x2:  x + w / 2, y2: y - intersectionW, cursor: 'default '};

    const hornList: any = [
      new Horn({ ...rightTop, ...basehorn }),
      new Horn({ ...leftTop, ...basehorn }),
      new Horn({ ...leftBottom, ...basehorn }),
      new Horn({ ...rightBottom, ...basehorn }),
      new Horn({ ...topMiddle, ...basehorn }),
      new Horn({ ...leftMiddle, ...basehorn }),
      new Horn({ ...rightMiddle, ...basehorn}),
      new Horn({ ...bottomMiddle, ...basehorn }),
      new Horn({ ...rotateRect, ...basehorn }),
      new Horn({ ...rotateLine, ...basehorn }),
    ];

    this.hornList = hornList;
  }

  filter(type: string, degree: number = 1) { // 滤镜
    let currentFilter: any;
    if (!this.currentContainter && this.imageList.length > 0) {
      const firstList = { ...this.imageList[0]};
      currentFilter = { ...this.imageList[0]};
      this.backOperation.push(new ImageRect(firstList));
    } else {
      currentFilter = { ...this.currentContainter };
      this.backOperation.push(new ImageRect({ ...this.currentContainter }));
    }
    this.imageList.forEach((item) => {
      if (currentFilter && currentFilter.uuid === item.uuid) {
        Object.assign(item, {
          filter: type,
          degree,
        });
      }
    });
    this.paintImage();
  }

  back(step: number = 1) { // 回退
    const stepIndex = step > this.backOperation.length ? 0 : this.backOperation.length - step;
    const lastOperation = this.backOperation[stepIndex]; // 回退到这一步
    const temOperation = this.backOperation.slice(0, stepIndex); // 回退后操作列表的缓存
    const list = lastOperation instanceof ImageRect ? this.imageList : lastOperation instanceof Rect ? this.rectList : [];
    if (lastOperation instanceof Path2D) { // 线段的回退
      const temLine = (temOperation || []).filter((item: any) => item instanceof Path2D);
      this.lineList = temLine || [];
    } else if (lastOperation instanceof CanvsText) { // 文字的回退
      if (temOperation.some((i: any) => i.uuid === lastOperation?.uuid)) { // 如果操作步骤中含有要lastOperation操作则更新文字，否则在列表中删除这条文案
        this.textList.forEach((item) => {
          if (item?.uuid === lastOperation?.uuid) {
            Object.assign(item, {
              ...lastOperation,
            });
          }
        });
      } else {
        this.textList = this.textList.filter((i: CanvsText) => i.uuid !== lastOperation?.uuid);
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
      this.paintAll(this.currentContainter, lastOperation instanceof CanvsText);
    }

    this.backOperation = temOperation;
  }

  paintBrush(option: paintBrushProps) { // 画笔
    this.paintStart = true;
    this.paintColor = option?.color || 'black';
    this.lineWidth = option?.lineWidth || 1;
  }

  addWrite(option: TextTemProps) { // 写文字
    this.isWrite = true;
    option.uuid = uuid();
    option.Canvas = this;
    Object.assign(this.currentAddWrite, {
      ...option,
    });
  }

  editWrite() { // 文字编辑
    this.isEdit = true;
  }

  changeParentAttribute() {
    this.isEdit = false;
    this.isWrite = false;
  }
  changeParentwStatus() {
    this.isWrite = false;
  }


  ImageRotate(ele: ImageRect) {
    this.editCtx.save();
    this.editCtx.translate(ele.x + ele.width / 2, ele.y + ele.height / 2);
    this.editCtx.rotate(ele?.radian || 0);
    this.editCtx.translate(-(ele.x + ele.width / 2), -(ele.y + ele.height / 2));
    this.editCtx.clearRect(ele.x, ele.y, ele.width, ele.height);
    this.editCtx.drawImage(ele.img, ele.x, ele.y, ele.width, ele.height);
    if(ele.filter) {
      (ele.filter === '模糊' || ele.filter === '马赛克') ? ele.VagueMosaic(ele.filter) : ele.paintFilter(FilterMap[ele.filter]);
    }
    this.editCtx.restore();
  }

  paintImage(first?: boolean) {
    this.imageList.forEach((ele: ImageRect) => {
      if (ele.img) {
        if (!first) {
          this.ImageRotate(ele);
        } else {
          ele.img.onload = () => {
            this.ImageRotate(ele);
          }
        }
      }
    });
  }

  paintRect() {
    this.rectList.forEach(ele => {
      this.editCtx.save();
      this.editCtx.beginPath()
      this.editCtx.translate(ele.x + ele.width / 2, ele.y + ele.height / 2);
      this.editCtx.rotate(ele.radian ?? 0);
      this.editCtx.translate(-(ele.x + ele.width / 2), -(ele.y + ele.height / 2));
      this.editCtx.rect(ele.x, ele.y, ele.width, ele.height);
      this.editCtx.strokeStyle = ele.color;
      this.editCtx.stroke();
      this.editCtx.restore();
    });
  }

  repaintLine() { // 清空画布时重绘线段
    this.lineList.forEach((item: Path2D) => {
      this.editCtx.stroke(item);
    });
  }

  paintText() { // 画文字
    this.textList.forEach((item) => {
      this.editCtx.font = item.font;
      const height = Number(item.font.slice(0, item.font.indexOf('px')));
      item.setInputAttribute(item.x, item.y);
      this.editCtx.fillText(item?.value || '', item.x, item.y + height / 1.3);
    });
  }
  

  paintAll(option: BaseHornProps, cancel: boolean = false) {
    this.editCtx.clearRect(0, 0, this.width, this.height);
    this.paintRect();
    this.paintImage();
    this.repaintLine();
    this.paintText();
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
        const t = new CanvsText({ ...downinfo, noPaint: true });
        this.backOperation.push(t);
      }
    }
  }

  mouseJudge(e: MouseEvent, type: 'down' | 'move') {
    let cursor = 'default';
    const point = {  x: e.offsetX, y: e.offsetY };
    const currentDown: any = ([...this.hornList, ...this.rectList, ...this.imageList, ...this.textList].find((ele: imageProps | RectProps | HornProps | TextProps) => {
      const w = ele instanceof Horn ? this.hornW : ele.width ?? 0;
      const h = ele instanceof Horn ? this.hornW : ele.height ?? 0;
      const shape = {
        width: w,
        height: h,
        radian: ele.radian ?? 0,
        position : { x: ele.x + w / 2, y: ele.y + h / 2 }
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

    if (currentDown && type === 'move') {
      const IsRect = currentDown instanceof Rect || currentDown instanceof ImageRect;
      const isHorn = currentDown instanceof Horn;
      if (IsRect) {
        cursor = 'move';
      }
      if (currentDown instanceof CanvsText) {
        cursor = this.isEdit ? 'text' : 'move';
      }
      if (isHorn && !currentDown.cancel) {
        cursor = currentDown.cursor;
      }
    }
    return type === 'move' ? cursor : currentDown;
  }

  onmousedown(e: MouseEvent) {
    if (this.isWrite) {
      Object.assign(this.currentAddWrite, { // 点击的位置就是文本框的位置
        x: e.offsetX,
        y: e.offsetY,
      });
      const obj = { ...this.currentAddWrite };
      const textInfo = new CanvsText(obj)
      this.textList.push(textInfo);
      this.backOperation.push(textInfo);
      this.isWrite = false;
    } else if (this.paintStart) {
      const linePaint = new Line({ Canvas: this, paintColor: this.paintColor, lineWidth: this.lineWidth });
      linePaint.mousedown(e)
    } else {
      const currentDown = this.mouseJudge(e, 'down');
      this.currentShape = currentDown;
      if (!currentDown) {
        this.paintAll(this.currentContainter || {}, true); // 删除horn
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
  }

  mousemove(e: MouseEvent) {
    let cursor = 'default';
    if (!this.paintStart && !this.isWrite) {
      cursor = this.mouseJudge(e, 'move');
    }
    this.canvas.style.cursor = cursor;
  }

};


export type DragCanvasType = DragCanvas;

export default DragCanvas;