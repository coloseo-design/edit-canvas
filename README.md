# edit-canvas
画布操作


### EditCanvas 方法

const canvas = new EditCanvas();
- **attach**: 为canvas添加container, attach(HTMLElement) => void
- **add**: 为canvas添加子集 例如:Image, Text, Graffiti,Graphics, add(Image|Text|Graffiti|Graphics) => void
- **clearCanvas**: 清空画布方法, () => void
- **deleteGraffiti**: 删除上一步画笔方法 () => void;
- **revokeGraffiti**:撤销删除画笔的方法 () => void;
- **getSelectedGraphics**: 获取当前选中的图形 () => void;
- **startGraffiti**: 画笔开始调用的方法 () => void;
- **endGraffiti**: 画笔结束调用的方法 () => void;
- **getImage**: 获取传入的图形生成的图片，画笔与图形等宽等高的图片，画笔原始大小的图片(Image|Text|Graffiti|Graphics) => Promise<({ cropSrc, mainSrc, graffitiSrc })>;
- **setScale**: 设置是否展示刻度的方法， (show: boolean) => void;
- **changeBgColor**: 设置画布背景色(color: number(十六进制)) => void;


### Image 图片 API

- **position**: 图片的位置,必传, { x: number, y: number }
- **url**: 图片的src,必传m string
- **width**: 图片的宽, number
- **height**:图片的高, number
- **text**: 图片文案, string 类型
- **delete**: 清除图片，() => void;


### Text 文字 API

- **position**: 文字的位置,必传, { x: number, y: number }
- **style**: 文字样式, PIXI.TextStyle
- **value**: 文字描述: string
- **height**:文字的高, number；
- - **width**:文字的宽, number
- **delete**: 清除文字，() => void;


### Graphics 矩形 API

- **position**: 矩形的位置,必传, { x: number, y: number }
- **lineStyle**: 矩形边框样式: { width?: number, color?: number, alpha?: number, alignment?: number, native?: boolean }
- **height**:矩形的高, number
- **background**:矩形填充色
- **alpha**:矩形填充色透明度
- **width**:矩形的宽, number
- **delete**: 清除矩形，() => void;


### Graffiti 矩形 API

- **color**: 画笔颜色
- **lineWidth**:画笔的宽度
- **alpha**:画笔颜色透明度
- **delete**: 清除矩形，() => void;


### demo示例
```
import React, { useEffect, useRef } from 'react';
import EditCanvas, { Text, Image, Graphics, Graffiti } from 'edit-canvas';
const Demo = () => {
  const canvasRef = useRef<EditCanvas>(null);
  useEffect(() => {
    const app = new EditCanvas();
    app.attach(canvasRef.current);
    const text = new Text({
      value: '测试文案',
      position: {
        x: 200,
        y: 20,
      },
      style: {
        fontSize: 30,
        fill: 0x000000,
        fontWeight: "900",
        wordWrap: true,
      },
    });
    const img = new Image({
      url: require('./assets/cat.png'),
      position: {
        x: 200,
        y: 200,
      },
      width: 300,
      height: 300,
    });
    const graphics = new Graphics({
      position: {
        x: 0,
        y: 0,
      },
      background: 0xff0000,
      width: 100,
      height: 100,
    });
    const graffiti = new Graffiti();
    app.add(text);
    app.add(img);
    app.add(graphics);
    app.add(graffiti);
  }, []);
  return (
    <div>
      <div ref={canvasRef}></div>
    </div>
  )
}


```