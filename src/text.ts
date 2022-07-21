export interface TextProps {
  x: number;
  y: number;
  font: string;
  characterNumber: number;
}

class CanvsText {
  public x: number;
  public y: number;
  public font: string;
  public characterNumber: number;

  constructor({ x, y, font, characterNumber }: TextProps) {
    this.x = x;
    this.y = y;
    this.font = font;
    this.characterNumber = characterNumber;
  }

  mousedown = (e: MouseEvent) => {
    document.onkeydown = () => {
      
    }
  }
};

export default CanvsText;