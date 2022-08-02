import DragCanvas from './canvas';
import { Vague, Mosaic, Reverse, BackWhite, Relief, Grey, Red } from './utils';

export interface imageProps {
  x: number;
  y: number;
  width: number;
  height: number;
  Canvas?: DragCanvas;
  radian?: number;
  uuid?: string;
  filter?: string;
  degree?: number;
  src: string;
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

class ImageRect { // 图片
  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public Canvas?: DragCanvas;
  public src: string;
  public img?: HTMLImageElement; // 图像
  public radian?: number; // 旋转的弧度
  public uuid?: string;
  public filter?: string; // 滤镜
  public degree?: number; // 模糊和马赛克的 模糊程度 数值越大，越模糊


  public offsetScreenCanvas?: HTMLCanvasElement;
  public offsetScreenCtx?: CanvasRenderingContext2D | null;

  constructor ({ width, height, x, y,  Canvas, radian = 0, uuid, filter, degree = 1, src }: imageProps) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.Canvas = Canvas;
    this.radian = radian;
    this.uuid = uuid;
    this.filter = filter;
    this.degree = degree;
    this.src = src;

    const ratio = window.devicePixelRatio || 1;
    this.offsetScreenCanvas = document.createElement('canvas');
    this.offsetScreenCtx = this.offsetScreenCanvas.getContext('2d');
    this.offsetScreenCtx?.scale(ratio, ratio);
  }

  paint() {
    const img = new Image();
    img.src = this.src;
    this.img = img;
    img.onload = () => {
      this.paintImage();
    }
  }

  delete() {
    if (this.Canvas) {
      const { editCtx} = this.Canvas;
      editCtx.save();
      editCtx.translate(this.x + this.width / 2, this.y + this.height / 2);
      editCtx.rotate(this?.radian || 0);
      editCtx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
      editCtx.clearRect(this.x, this.y, this.width, this.height);
      editCtx.restore();
    }
  }

  filters(f: string, degree: number = 1) {
    this.Canvas?.backOperation.push(new ImageRect(this)); // 存储操作步骤
    this.filter = f;
    this.degree = degree;
    this.paintImage();
  }

  paintImage() {
    if(this.offsetScreenCtx && this.offsetScreenCanvas && this.img) {
      const ratio = window.devicePixelRatio || 1;
      this.offsetScreenCanvas.width = this.width * ratio;
      this.offsetScreenCanvas.height = this.height * ratio;
      this.offsetScreenCanvas.style.width = this.width + 'px';
      this.offsetScreenCanvas.style.height = this.height + 'px';
      // 图像宽高改变，图像画布也跟着改变
      this.offsetScreenCtx.clearRect(0, 0, this.offsetScreenCanvas.width, this.offsetScreenCanvas.height);
      this.offsetScreenCtx.drawImage(this.img, 0, 0, this.width * ratio, this.height * ratio);
      if (this.filter) {
        const imageData: ImageData = this.offsetScreenCtx.getImageData(0, 0, this.width * ratio, this.height * ratio);
          const data = imageData.data;
          if (this.filter === '模糊' || this.filter === '马赛克') {
            const args = { data, degree: this.degree, width: this.width * ratio, height: this.height * ratio }
            this.filter === '模糊' ? Vague(args) : Mosaic(args);
          } else {
            const fn  = FilterMap[this.filter];
            for(let i = 0, len = data.length; i < len; i+=4){
              fn(data,i)
            }
          }
          this.offsetScreenCtx.putImageData(imageData, 0, 0);
      }
      this.Canvas?.editCtx.save();
      this.Canvas?.editCtx.translate(this.x + this.width / 2, this.y + this.height / 2);
      this.Canvas?.editCtx.rotate(this?.radian || 0);
      this.Canvas?.editCtx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
      this.Canvas?.editCtx.clearRect(this.x, this.y, this.width, this.height);
      this.Canvas?.editCtx.drawImage(this.offsetScreenCanvas, this.x, this.y, this.width, this.height);
      this.Canvas?.editCtx.restore();
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