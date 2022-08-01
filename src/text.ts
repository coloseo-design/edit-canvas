import DragCanvas from './canvas';

export interface TextProps {
  x?: number;
  y?: number;
  font?: string;
  Canvas?: DragCanvas;
  value?: string;
  width?: number;
  height?: number;
  uuid?: string;
  color?: string;
  radian?: number; 
  input?: HTMLInputElement | null;
}

class CanvsText {
  public x: number;
  public y: number;
  public font: string;
  public Canvas?: DragCanvas;

  public isChinaStart: boolean;

  public value: string;

  public notChainese: string;

  public input?: HTMLInputElement | null;

  public width: number;

  public height: number;

  public uuid?: string;

  public color?: string;

  public cursorColor?: string;

  public isAddText?: boolean = false;

  constructor({ x = 0, y = 0, font = '20px serif', Canvas, uuid, color, value = '' }: TextProps) {
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
    this.cursorColor = 'black';
    this.height = Number(font.slice(0, font.indexOf('px'))) || 20;
  }

  setInputAttribute(x: number, y: number) {
    if (this.input) {
      this.input.style.top = `${y}px`;
      this.input.style.left = `${x}px`;
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
        border: none; outline: none;
        z-index: 10;
        font-size: ${this.height}px;
        caret-color: black;
        color: transparent;
        background: transparent;
        `
        );
      const parentNode = this.Canvas?.canvas.parentNode;
      parentNode && parentNode.appendChild(this.input);
      this.input.addEventListener('input', this.oninput.bind(this));
      this.input.addEventListener('blur', this.onblur.bind(this));
      this.input.addEventListener('foucs', this.onfoucs.bind(this));
      this.input.addEventListener('compositionstart', this.oncompositionstart.bind(this));
      this.input.addEventListener('compositionend', this.oncompositionend.bind(this));
      setTimeout(() => {
        this.input && this.input?.focus();
      }, 10);
    }

  }

  paint() {
    if (this.input) {
      this.setInputAttribute(this.x, this.y);
      this.Canvas?.editCtx.fillText(this?.value || '', this.x, this.y + this.height / 1.3);
    }
  }

  delete() {
    this.input && this.Canvas?.canvas.parentNode?.removeChild(this.input);
    this.input = null;
    this.value = '';
    this.x = 0;
    this.y = 0;
  }

  writeText() {
    this.isAddText = true;
    if (this.Canvas) {
      const { canvas } = this.Canvas;
      if (this.input) { // 如果input存在则编辑文字
        this.input.style.zIndex = '10';
        this.input.focus();
        this.input.value = this.value;
      }
      canvas.onmousedown = (e) => {
        // 第一次添加input
        const temInput = this.input;
        this.input = this.input || document.createElement('input');
        if (!temInput) {
          this.x = e.offsetX;
          this.y = e.offsetY;
          this.createText();
          this.Canvas?.textList.push(this);
          this.Canvas?.backOperation.push(this);
        }
        this.mousedown(e);
      }
    }
  }

  oncompositionstart() { // 开始输入中文
    this.isChinaStart = true;
  }

  oncompositionend() { // 中文输入完
    this.isChinaStart = false;
    this.changePaint();
  }

  changePaint() {
    if (this.Canvas && this.input) {
      const val = this.isChinaStart ? this.notChainese : this.value;
      const partenEnglish =/[\A-Za-z0-9\p{P}]/g;
      const res = val.match(partenEnglish) || '';
      const Punpat = /[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/g // 判断英文标点符号
      const EnglishPun = val.match(Punpat) || '';
      const enlishpunlen = EnglishPun.length; // 英文标点符号占fontsize的1/3
      const englishLen = res.length; // 英文数字字符 (英文数字字符宽度占fontsize的一半)
      const chineseLen = val.length - englishLen - enlishpunlen; // 中文字符（中文字符宽度为一个fontsize）
      this.Canvas.editCtx.font = this.font;
      this.Canvas.editCtx.fillStyle = this.color || 'black';
      const width = this.height * chineseLen + this.height * (englishLen / 2) + this.height * (enlishpunlen / 3);
      this.input.style.width = `${width}px`;
      this.width = width;
      this.height = this.height;
      (this.Canvas?.textList || []).forEach((item) => {
        if (item.uuid === this.uuid) {
          this.Canvas?.editCtx.clearRect(item.x, item.y, item.width, item.height);
          Object.assign(item, {
            width,
            value: val,
          })
        }
      });
      val && this.Canvas?.editCtx.fillText(val, this.x, this.y + this.height / 1.3);
    }
  }
 
  oninput(e: any) {
    this.value = e.target.value;
    if (this.isChinaStart) return; // 表示在输入中文拼音阶段不展示在画布上
    this.notChainese = e.target.value;
    this.changePaint();
  }

  onblur() {
    if (this.input) {
      this.input.style.zIndex = '-100';
    }
  }

  onfoucs() {
    if (this.input) {
      this.input.style.zIndex = '10';
    }
  }

  mousedown(e: MouseEvent) {
   if (!this.isAddText){
      const disX = e.pageX - this.x;
      const disY = e.pageY - this.y;
      if (this.Canvas) {
        this.Canvas.canvas.onmousemove = (mouseEvent) => {
          this.x = mouseEvent.pageX - disX;
          this.y = mouseEvent.pageY - disY;
          const obj = { x: this.x, y: this.y, width: this.width, height: this.height, radian: 0  };
          this.Canvas?.paintAll(obj, true);
        }
      }
    }
    if (this.Canvas) {
      this.Canvas.canvas.onmouseup = () => {
        this.isAddText = false;
        this.Canvas ?  this.Canvas.canvas.onmousemove = this.Canvas.canvas.onmousedown = null : null
      }
    }

  }

 };

export default CanvsText;