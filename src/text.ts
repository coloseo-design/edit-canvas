import DragCanvas from './canvas';

export interface TextProps {
  x: number;
  y: number;
  font: string;
  Canvas?: DragCanvas;
  value?: string;
  width?: number;
  height?: number;
  uuid?: string;
  color?: string;
  radian?: number; 
  noPaint?: boolean;
}

class CanvsText {
  public x: number;
  public y: number;
  public font: string;
  public Canvas?: DragCanvas;

  public isChinaStart: boolean;

  public value: string;

  public notChainese: string;

  public input: HTMLInputElement;

  public width: number;

  public height: number;

  public uuid?: string;

  public color?: string;

  public noPaint?: boolean;

  constructor({ x, y, font = '14px', Canvas, uuid, color, value = '', noPaint = false }: TextProps) {
    this.x = x;
    this.y = y;
    this.font = font;
    this.uuid = uuid;
    this.isChinaStart = false;
    this.value = value;
    this.notChainese = '';
    this.Canvas = Canvas;
    this.width = 100;
    this.color = color;
    this.noPaint = noPaint;
    this.input = document.createElement('input');
    this.height = Number(font.slice(0, font.indexOf('px'))) || 14;
    if (!noPaint) {
      this.createText();
    }
  }
  createText() {
    if (this.input) {
      this.input.setAttribute(
        'style', 
        `position: absolute;
        height: ${this.height}px;
        width: ${this.width}px;
        left: ${this.x}px;
        top: ${this.y}px;
        border: none; outline: none; z-index: 10;
        font-size: ${this.height}px;
        background: transparent;
        color: transparent;
        `
        );

      const parentNode = this.Canvas?.canvas.parentNode;
      parentNode && parentNode.appendChild(this.input);
      // this.input.focus();
      this.input.addEventListener('input', this.oninput.bind(this));
      this.input.addEventListener('blur', this.onblur.bind(this));
      this.input.addEventListener('foucs', this.onfoucs.bind(this));
      this.input.addEventListener('compositionstart', this.oncompositionstart.bind(this));
      this.input.addEventListener('compositionend', this.oncompositionend.bind(this));
    }

  }
  oncompositionstart() { // 开始输入中文
    this.isChinaStart = true;
  }

  oncompositionend(e: any) { // 中文输入完
    this.isChinaStart = false;
    this.paint();
  }

  paint() {
    if (this.Canvas) {
      const val = this.isChinaStart ? this.notChainese : this.value;
      const partenEnglish =/[\A-Za-z]/g;
      const res = val.match(partenEnglish) || '';
      const englishLen = res.length;
      const chineseLen = val.length - englishLen;
      this.Canvas.editCtx.font = this.font;
      this.Canvas.editCtx.fillStyle = this.color || 'black';
      val && this.Canvas?.editCtx.fillText(val, this.x, this.y + this.height / 1.3);
      const width = this.height * chineseLen + this.height * (englishLen / 2);
      this.input.style.width = `${width}px`;
      this.width = width;
      this.height = this.height;
      (this.Canvas?.textList || []).forEach((item) => {
        if (item.uuid === this.uuid) {
          Object.assign(item, {
            width,
            value: val,
          })
        }
      });
    }
  }
 
  oninput(e: any) {
    this.value = e.target.value;
    if (this.isChinaStart) return; // 表示早输入中文拼音阶段不展示在画布上
    this.notChainese = e.target.value;
    this.paint();
    this.Canvas?.changeParentwStatus();
  }

  onblur() {
    this.input.style.zIndex = '-100';
    this.Canvas?.changeParentAttribute();
  }
  onfoucs() {
    this.Canvas?.changeParentwStatus();
  }
  mousedown(e: MouseEvent) {
    if (this.Canvas?.isEdit) {
      this.input.style.zIndex = '10';
      this.input.value = this.value;
      this.input.style.top = `${this.y}px`;
      this.input.style.left = `${this.x}px`;
      // this.input.focus();
    } else {
      const disX = e.pageX - this.x;
      const disY = e.pageY - this.y;
      if (this.Canvas) {
        this.Canvas.canvas.onmousemove = (mouseEvent) => {
          this.x = mouseEvent.pageX - disX;
          this.y = mouseEvent.pageY - disY;
          const obj = { x: this.x, y: this.y, width: this.width, height: this.height, radian: 0  };
          this.Canvas?.paintAll(obj, true);
          this.input.style.top = `${this.y}px`;
          this.input.style.left = `${this.x}px`;
        }
        this.Canvas.canvas.onmouseup = () => {
          this.Canvas ?  this.Canvas.canvas.onmousemove = this.Canvas.canvas.onmousedown = null : null
        }
      }
    }

  }
 };

export default CanvsText;