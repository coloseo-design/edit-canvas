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
  isOperation?: boolean;
  level?: number;
  textAlign?: CanvasTextAlign;
}

class CanvasText {
  public x?: number;
  public y?: number;
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

  public radian?: number = 0;

  public isOperation?: boolean; // 是否可以操作（移动变形等）

  public level?: number; // 图形的层级

  public textAlign?: CanvasTextAlign;

  constructor({
    x, y, font = '20px serif', Canvas, uuid, color, value = '', isOperation = true, level = 1,
    textAlign = 'center', width = 100, height = 20
  }: TextProps) {
    this.x = x;
    this.y = y;
    this.font = font;
    this.uuid = uuid;
    this.isChinaStart = false;
    this.value = value;
    this.notChainese = '';
    this.Canvas = Canvas;
    this.width = width;
    this.color = color;
    this.cursorColor = 'black';
    this.height = Number(font.slice(0, font.indexOf('px'))) || height;
    this.isOperation = isOperation;
    this.level = level;
    this.textAlign = textAlign;
  }

  setInputAttribute(x: number = 0, y: number = 0) {
    if (this.input) {
      const tGap = this.Canvas?.topGap || 0;
      const lGap = this.Canvas?.leftGap || 0;
      this.input.style.top = `${y + tGap}px`;
      this.input.style.left = `${x + lGap}px`;
    }
  }

  createText(isFocus = false) {
    if (this.input) {
      const tGap = this.Canvas?.topGap || 0;
      const lGap = this.Canvas?.leftGap || 0;
      this.input.setAttribute(
        'style', 
        `position: absolute;
        height: ${this.height}px;
        min-width: ${this.width}px;
        left: ${(this.x || 0) + lGap}px;
        top: ${(this.y || 0) + tGap}px;
        border: none; outline: none;
        z-index: ${isFocus ? '10' : '-100'};
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
      this.input.addEventListener('focus', this.onfocus.bind(this));
      this.input.addEventListener('compositionstart', this.oncompositionstart.bind(this));
      this.input.addEventListener('compositionend', this.oncompositionend.bind(this));
      if (isFocus) {
        setTimeout(() => {
          this.input && this.input?.focus();
        }, 10);
      }
    }

  }

  paint() {
    if (this.Canvas && typeof this.x !== 'undefined' && typeof this.y !== 'undefined') {
      const temInput = this.input;
      this.input = this.input || document.createElement('input');
      if (!temInput && this.isOperation) {
        this.input.value = this.value;
        this.createText();
      } else {
        this.setInputAttribute(this.x, this.y);
      }
      this.Canvas.editCtx.save();
      this.Canvas.editCtx.translate(this.x + this.width / 2, this.y + this.height / 2);
      this.Canvas.editCtx.rotate(this.radian ?? 0);
      this.Canvas.editCtx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
      this.Canvas.editCtx.font = this.font;
      // this.Canvas.editCtx.textAlign = this.textAlign || 'left';
      this.Canvas.editCtx.fillStyle = this.color || 'black';
      this.Canvas?.editCtx.fillText(this?.value || '', this.x, this.y + this.height / 1.3);
      this.Canvas.editCtx.restore();
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
        const temInput = this.input;
        this.input = this.input || document.createElement('input');
        if (!temInput) {
          this.x = e.offsetX;
          this.y = e.offsetY;
          this.createText(true);
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

  getValueWidth(val: string) {
    const filterEnglish =/[\A-Za-z0-9\p{P}]/g;
    const res = val.match(filterEnglish) || '';
    const punctuationE = /[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/g // 判断英文标点符号
    const EnglishPun = val.match(punctuationE) || '';
    const englishPunLen = EnglishPun.length; // 英文标点符号占fontsize的1/3
    const englishLen = res.length; // 英文数字字符 (英文数字字符宽度占fontsize的一半)
    const chineseLen = val.length - englishLen - englishPunLen; // 中文字符（中文字符宽度为一个fontsize）
    const width = this.height * chineseLen + this.height * (englishLen / 2) + this.height * (englishPunLen / 3);
    return width;
  }

  changePaint() {
    if (this.Canvas && this.input) {
      const val = this.isChinaStart ? this.notChainese : this.value;
      const width = this.getValueWidth(val);
      this.input.style.minWidth = `${width}px`;
      this.height = this.height;
      this.Canvas.editCtx.font = this.font;
      this.Canvas.editCtx.fillStyle = this.color || 'black';
      const textList = this.Canvas.shapeList.filter((item) => item instanceof CanvasText) as CanvasText[];
      (textList || []).forEach((item) => {
        if (item.uuid === this.uuid) {
          this.Canvas?.editCtx.clearRect(item.x || 0, item.y || 0, item.width, item.height);
          Object.assign(item, {
            width,
            value: val,
          })
        }
      });
      // val && this.Canvas?.editCtx.fillText(val, this.x || 0, (this.y || 0) + this.height / 1.3);
      this.Canvas?.paintAll({x: this.x || 0, y: this.y || 0, height: this.height, width: this.width, radian: this.radian || 0 }, true);
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

  onfocus() {
    if (this.input) {
      this.input.style.zIndex = '10';
    }
  }

  mousedown(e: MouseEvent) {
   if (!this.isAddText){
      const disX = e.pageX - (this.x || 0);
      const disY = e.pageY - (this.y || 0);
      if (this.Canvas) {
        this.Canvas.canvas.onmousemove = (mouseEvent) => {
          this.x = mouseEvent.pageX - disX;
          this.y = mouseEvent.pageY - disY;
          const obj = { x: this.x, y: this.y, width: this.width, height: this.height, radian: 0  };
          this.Canvas?.paintAll(obj, false);
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

export default CanvasText;