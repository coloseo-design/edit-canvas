# edit-canvas
画布操作


### EditCanvas 方法

const canvas = new EditCanvas();
- **attach**: 为canvas添加container, attach(HTMLElement) => void
- **detach**: 在组件卸载时调用
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
- **onPointerdown**: 鼠标按下事件(e: InteractionEvent) => void;
- **onPointerup**: 鼠标松开事件(e: InteractionEvent) => void;
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
- **onPointerdown**: 鼠标按下事件(e: InteractionEvent) => void;
- **onPointerup**: 鼠标松开事件(e: InteractionEvent) => void;
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
- **onPointerdown**: 鼠标按下事件(e: InteractionEvent) => void;
- **onPointerup**: 鼠标松开事件(e: InteractionEvent) => void;
- **getImage**: 生成当前Graphics大小的图片, () => base64;
- **getBoundRect**: 获取当前Graphics的宽高位置: () => ({ x, y, width, height });


### Graffiti 涂鸦 API

- **color**: 画笔颜色 默认 0x6078F4
- **lineWidth**:画笔的宽度 默认 10
- **alpha**:画笔颜色透明度 默认 0.5
- **delete**: 清除矩形，() => void;
- **setStyle**: 修改画笔样式({color, alpha, lineWidth}) => void;
- **onClick**: 点击事件(e: InteractionEvent) => void;
- **onPointerdown**: 鼠标按下事件(e: InteractionEvent) => void;
- **onPointerup**: 鼠标松开事件(e: InteractionEvent) => void;
- **getImage**: 不传ele生成当前Graffiti大小的图片, 传入ele生成ele大小的图片，如果Graffiti的位置宽高不在ele里面则截取, (ele?: Image | Text | Graphics | Graffiti | Layer) => Promise<url: string>
- **getBoundRect**: 获取当前Graffiti的宽高位置: () => ({ x, y, width, height });
- **setStyle**: 设置涂鸦画笔的线宽，颜色，透明度, ({ color, alpha, lineWidth }) => void;


### Layer 图层 API

- **position**: 图层位置{ x: number, y: number };
- **width**: 图层宽 number;
- **height** 图层高 number；
- **background**: 图层背景色 number 默认 0xffffff;
- **alpha**: 图层透明度 number 默认 1;
- **getImage**: 生成图层大小并且与图层交叉的内容图片 () => Promise<url: string>;
- **getBoundRect**: 获取当前图层的位置和宽高 () => ({ x, y, width, height });
- **delete**:在画布中删除当前图层;
- **onClick**: 点击事件(e: InteractionEvent) => void;
- **onPointerdown**: 鼠标按下事件(e: InteractionEvent) => void;
- **onPointerup**: 鼠标松开事件(e: InteractionEvent) => void;


### demo示例
```
import React, { useEffect, useState, useRef } from 'react';
import EditCanvas, { Image, Text, Graffiti, Graphics, Layer } from 'edit-canvas';


const Demo = () => {
  const canvas = useRef<EditCanvas>();
  const text = useRef<Text>();
  const img = useRef<Image>();
  const img1 = useRef<Image>();
  const [ffis, setFfi] = useState<Graffiti[]>([]);
  const layer = useRef<Layer>();
  useEffect(() => {
    const canvasContainer = document.getElementById('canvas-container');
    const app = new EditCanvas();
    canvas.current = app;
    if (canvasContainer) {
      app.attach(canvasContainer);
      app.setScale(true);
      const image = new Image({
        url: require('./assets/cat.png'),
        position: {
          x: 200,
          y: 200,
        },
        width: 300,
        height: 300,
      });
      img.current = image;
      const image1 = new Image({
        url: 'http://47.109.84.94/api/file-1713170051377.jpg',
        position: {
          x: 20,
          y: 200,
        },
        width: 150,
        height: 250,
      });
      img1.current = image1;
      const text1 = new Text({
        style: {
          fontSize: 30,
          fill: 0x000000,
          fontWeight: "900",
          wordWrap: true,
        },
        value: '测试文字',
        position: {
          x: 400,
          y: 230,
        },
      });
      text.current = text1;
      const g = new Graphics({
        position: {
          x: 0,
          y: 0,
        },
        width: 100,
        height: 100,
      })
      app.add(g);
      app.add(image);
      app.add(text1);
      app.add(image1);
      image.onClick = (e) => {
        console.log('=image click>>', image.getBoundRect());
      }
    }
    return () => {
      canvasContainer && app.detach(canvasContainer);
    }
  }, []);

  const start = () => {
    const graffiti = new Graffiti();
    canvas.current?.add(graffiti);
    ffis.push(graffiti);
    setFfi(ffis);
    canvas.current?.startGraffiti();
  }

  const end = () => {
    canvas.current?.endGraffiti();
  }

  const handleDelete = () => {
    const selected = canvas.current?.getSelectedGraphics();
    if (selected) {
      selected.delete();
      setFfi(ffis.filter((i) => i.uuid !== selected.uuid));
    }
  }


  const handleText = () => {
    text.current?.writeText();
  }

  const handleImage =  async () => {
    if (canvas.current && img) {
      const image = (img.current as Image).getImage();
      const fi = ffis[ffis.length - 1];
      const graffitiImg = await fi?.getImage();
      const boxGraffitiImg = await fi?.getImage(img.current);
      console.log('==>>底片', image);
      console.log('==>>涂鸦', graffitiImg);
      console.log('==>> 涂鸦与底片同大', boxGraffitiImg);
    }
  }

  const handleAdd = () => {
    const lay = new Layer({
      position: {
        x: 150,
        y: 150,
      },
      width: 350,
      height: 350,
    });
    canvas.current?.add(lay);
    layer.current = lay;
  }

  const handleLayer = async () => {
    if (layer.current) {
      const src = await layer.current?.getImage();
      console.log('==src', src);
    }
  };

  const handleIndex = () => {
    canvas.current?.setIndex(text.current);
  }

  const handleClear = () => {
    canvas.current?.clearCanvas();
  }

  return (
    <div style={{ display: 'flex', height: '100vh'}}>

      <div style={{ display: 'flex', padding: 16, flexDirection: 'column' }}>
      <button  onClick={start}>涂鸦</button>
      <br />
      <button onClick={end}>停止涂鸦</button>
      <br />
      <button onClick={handleDelete}>删除当前选中图形</button>
      <br />
      <button onClick={handleText}>编辑文字</button>
      <br />
      <button onClick={handleImage}>生成图片</button>
      <br />
      <button onClick={() => canvas.current?.back()}>回退</button>
      <br />
      <button onClick={() => canvas.current?.revoke()}>撤销回退</button>
      <br />
      <button onClick={handleAdd}>添加新的图层</button>
      <br />
      <button onClick={handleLayer}>生成图像外延图片</button>
      <button onClick={handleIndex}>改变文字的层级</button>
      <br />
      <button onClick={handleClear}>清空画布</button>
      </div>
      <div id="canvas-container" style={{ flex: 1, height: '100%', position: 'relative' }} />
    </div>
  )
}

export default Demo;


```