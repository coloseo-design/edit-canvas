import DragCanvas, { imageProps } from './canvas';
import { Vague, Mosaic, Reverse, BackWhite, Relief, Grey, Red } from './utils';

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

class ImageRect { // 图片
  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public Canvas?: DragCanvas;
  public img: HTMLImageElement; // 图像
  public radian?: number; // 旋转的弧度
  public uuid?: string;
  public filter?: string; // 滤镜
  public degree?: number; // 模糊和马赛克的 模糊程度 数值越大，越模糊

  public data: any;
  constructor ({ width, height, x, y,  Canvas, img, radian = 0, uuid, filter, degree = 1 }: imageProps) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.Canvas = Canvas;
    this.img = img;
    this.radian = radian;
    this.uuid = uuid;
    this.filter = filter;
    this.degree = degree;

    this.data = [];
  }
  paint() {
    this.Canvas?.editCtx.save();
    this.Canvas?.editCtx.translate(this.x + this.width / 2, this.y + this.height / 2);
    this.Canvas?.editCtx.rotate(this?.radian || 0);
    this.Canvas?.editCtx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    this.Canvas?.editCtx.clearRect(this.x, this.y, this.width, this.height);
    this.Canvas?.editCtx.drawImage(this.img, this.x, this.y, this.width, this.height);
    if(this.filter) {
      (this.filter === '模糊' || this.filter === '马赛克') ? this.VagueMosaic(this.filter) : this.paintFilter(FilterMap[this.filter]);
    }
    const ratio = this.Canvas?.ratio || 1;
    const imageData: any = this.Canvas?.editCtx.getImageData(this.x * ratio, this.y * ratio, this.width * ratio, this.height * ratio);
    this.Canvas?.editCtx.restore();
  }

  paintFilter(fn: Function) {
    if (this.Canvas) {
      const ratio = this.Canvas.ratio || 1;
      const imageData: ImageData = this.Canvas.editCtx.getImageData(this.x * ratio, this.y * ratio, this.width * ratio, this.height * ratio);
      const data = imageData.data;
      for(let i = 0, len = data.length; i < len; i+=4){
        fn(data,i, imageData.width)
      }
      this.Canvas?.editCtx.putImageData(imageData, this.x * ratio, this.y * ratio);
    }
  }

  VagueMosaic(type: string) {
    if (this.Canvas) {
      const ratio = this.Canvas.ratio || 1;
      const imageData: ImageData = this.Canvas.editCtx.getImageData(this.x * ratio, this.y * ratio, this.width * ratio, this.height * ratio);
      const data = imageData.data;
      const args = { data, degree: this.degree, width: this.width * ratio, height: this.height * ratio }
      type === '模糊' ? Vague(args) : Mosaic(args);
      this.Canvas?.editCtx.putImageData(imageData, this.x * ratio, this.y * ratio);
    }
  }

  mousedown(e: MouseEvent) {
    const disX = e.pageX - this.x;
    const disY = e.pageY - this.y;
    if (this.Canvas) {
      this.Canvas.canvas.onmousemove = (mouseEvent: MouseEvent) => {
        this.x = mouseEvent.pageX - disX;
        this.y = mouseEvent.pageY - disY;
        const obj = { x: this.x, y: this.y, width: this.width, height: this.height, radian: this.radian ?? 0  };
        this.Canvas?.paintAll(obj);
      }
      this.Canvas.canvas.onmouseup = () => {
        this.Canvas ?  this.Canvas.canvas.onmousemove = this.Canvas.canvas.onmousedown = null : null
      }
    }

  }
};

export default ImageRect;