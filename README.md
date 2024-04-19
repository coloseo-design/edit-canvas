# edit-canvas
画布操作


### EditCanvas 方法

const canvas = new EditCanvas();
- **attach**: 为canvas添加container, attach(HTMLElement) => void
- **add**: 为canvas添加子集 例如:Image, Text, Graffiti,Graphics, add(Image|Text|Graffiti|Graphics) => void
- **clearCanvas**: 清空画布方法, () => void
- **back**: 返回画布图形上一步操作, () => void
- **revoke**: 撤销画布图形返回的上一步操作, () => void;
- **getSelectedGraphics**: 获取当前选中的图形 () => Image | Text | Graphics | Graffiti | Layer;
- **startGraffiti**: 画笔开始调用的方法 () => void;
- **endGraffiti**: 画笔结束调用的方法 () => void;
- **getImage**: 生成当前画布的图片 () => base64;
- **setScale**: 设置是否展示刻度的方法， (show: boolean) => void;
- **changeBgColor**: 设置画布背景色(color: number(十六进制)) => void;


### Image 图片 API

- **position**: 图片的位置,必传, { x: number, y: number }
- **url**: 图片的src,必传m string
- **width**: 图片的宽, number
- **height**:图片的高, number
- **delete**: 清除图片，() => void;
- **onClick**: 点击事件(e: InteractionEvent) => void;
- **getImage**: 生成当前Image大小的图片, () => base64;
- **getBoundRect**: 获取当前Image的宽高位置: () => ({ x, y, width, height });


### Text 文字 API

- **position**: 文字的位置,必传, { x: number, y: number }
- **style**: 文字样式, PIXI.TextStyle
- **value**: 文字描述: string
- **height**:文字的高, number；
- **width**:文字的宽, number
- **delete**: 清除文字，() => void;
- **onClick**: 点击事件(e: InteractionEvent) => void;
- **getImage**: 生成当前Text大小的图片, () => base64;
- **getBoundRect**: 获取当前Text的宽高位置: () => ({ x, y, width, height });


### Graphics 矩形 API

- **position**: 矩形的位置,必传, { x: number, y: number }
- **lineStyle**: 矩形边框样式: { width?: number, color?: number, alpha?: number }
- **height**:矩形的高, number
- **background**:矩形填充色
- **alpha**:矩形填充色透明度
- **shape**: 图形类型 string类型， 'circle'圆形， 'rect'默认矩形, 'roundedRect'带圆角的矩形
- **radius**: 圆角矩形的圆角数值，只有shape: 'roundedRect'有效
- **width**:矩形的宽, number
- **delete**: 清除画笔，() => void;
- **onClick**: 点击事件(e: InteractionEvent) => void;
- **getImage**: 生成当前Graphics大小的图片, () => base64;
- **getBoundRect**: 获取当前Graphics的宽高位置: () => ({ x, y, width, height });


### Graffiti 涂鸦 API

- **color**: 画笔颜色
- **lineWidth**:画笔的宽度
- **alpha**:画笔颜色透明度
- **delete**: 清除矩形，() => void;
- **setStyle**: 修改画笔样式({color, alpha, lineWidth}) => void;
- **onClick**: 点击事件(e: InteractionEvent) => void;
- **getImage**: 不传ele生成当前Graffiti大小的图片, 传入ele生成ele大小的图片，如果Graffiti的位置宽高不在ele里面则截取, (ele?: Image | Text | Graphics | Graffiti | Layer) => Promise/<base64/>
- **getBoundRect**: 获取当前Graffiti的宽高位置: () => ({ x, y, width, height });
- **setStyle**: 设置涂鸦画笔的线宽，颜色，透明度, ({ color, alpha, lineWidth }) => void;


### Layer 图层 API

- **position**: 图层位置{ x: number, y: number };
- **width**: 图层宽 number;
- **height** 图层高 number；
- **background**: 图层背景色 number 默认 0xffffff;
- **alpha**: 图层透明度 number 默认 1;
- **getImage**: 生成图层大小并且与图层交叉的内容图片 () => Promise/<base64/>;
- **getBoundRect**: 获取当前图层的位置和宽高 () => ({ x, y, width, height });
- **delete**:在画布中删除当前图层;
- **onClick**: 点击事件(e: InteractionEvent) => void;


### demo示例
```
import React, { useEffect, useRef } from 'react';
import EditCanvas, { Text, Image, Graphics, Graffiti } from 'edit-canvas';
const Demo = () => {
  const canvasRef = useRef<EditCanvas>(null);
  useEffect(() => {
    const app = new EditCanvas();
    canvasRef.current = app;
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
    app.add(text);
    app.add(img);
    app.add(graphics);

    image.onClick = (e) => {
      console.log('=image click>>', e);
    }
  }, []);
  return (
    <div>
      <div ref={canvasRef}></div>
    </div>
  )
}


```