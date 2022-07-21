export interface TextProps {
    x: number;
    y: number;
    font: string;
    characterNumber: number;
}
declare class CanvsText {
    x: number;
    y: number;
    font: string;
    characterNumber: number;
    constructor({ x, y, font, characterNumber }: TextProps);
    mousedown: (e: MouseEvent) => void;
}
export default CanvsText;
