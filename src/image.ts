import DragCanvas, { imageProps } from './canvas';
import { Vague, Mosaic } from './utils';

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
  }

  paintFilter(fn: Function) {
    const ratio = this.Canvas?.ratio || 1;
    const imageData: any = this.Canvas?.editCtx.getImageData(this.x * ratio, this.y * ratio, this.width * ratio, this.height * ratio);
    const obj: any = { ...imageData };
    for(const key in imageData) { // 利用浅拷贝改变imageData的data
      Object.assign(obj, {
        [key]: imageData[key]
      });
    }
    const data = obj.data;
    for(let i = 0, len = data.length; i < len; i+=4){
      fn(data,i, imageData.width)
    }
    obj.data = data;
    this.Canvas?.editCtx.putImageData(imageData, this.x * ratio, this.y * ratio);
  }

  VagueMosaic(type: string) {
    const ratio = this.Canvas?.ratio || 1;
    const imageData: any = this.Canvas?.editCtx.getImageData(this.x * ratio, this.y * ratio, this.width * ratio, this.height * ratio);
    if (imageData) {
      const obj: any = { ...imageData };
      for(const key in imageData) { // 利用浅拷贝改变imageData的data
        Object.assign(obj, {
          [key]: imageData[key]
        });
      }
      const data = obj.data;
      const args = { data, degree: this.degree, width: this.width * ratio, height: this.height * ratio }
      type === '模糊' ? Vague(args) : Mosaic(args);
      obj.data = data; 
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