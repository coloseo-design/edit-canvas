import React, { useEffect, useState } from 'react';
import EditCanvas, { Image, Text, Graffiti, Graphics } from './components/index';;


const Demo = () => {
  const [app, setApp] = useState<EditCanvas>();
  const [text, setText] = useState<Text>();
  const [img, setImg] = useState<Image>();
  const [gra, setGra] = useState<Graphics>();
  useEffect(() => {
    const canvasContainer = document.getElementById('canvas-container');
    const app = new EditCanvas();
    setApp(app);
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
      const g = new Graphics({
        position: {
          x: 0,
          y: 0,
        },
        width: 100,
        height: 100,
      })
      setText(text1);
      setImg(image);
      setGra(g);
      app.add(g);
      app.add(image);
      app.add(text1);
    }
    return () => {
      canvasContainer && app.detach(canvasContainer);
    }
  }, []);

  const start = () => {
    const graffiti = new Graffiti();
    app?.add(graffiti);
    app?.startGraffiti();
  }

  const end = () => {
    app?.endGraffiti();
  }

  const handleDelete = () => {
    const selected = app?.getSelectedGraphics();
    selected && selected.delete();
  }

  const deleteBrush = () => {
    app?.deleteGraffiti();
  }

  const backBrush = () => {
    app?.revokeGraffiti();
  }

  const handleText = () => {
    text?.writeText();
  }

  const handleImage =  async () => {
    if (app) {
      const { cropSrc, mainSrc, graffitiSrc } =  await app.getImage(img);
      console.log('=graffitiSrc', graffitiSrc);
      console.log('==croppingSrc', cropSrc);
      console.log('==mainSrc', mainSrc);
    }
  }

  return (
    <div>
      <button onClick={start}>涂鸦</button>
      <button onClick={end}>停止涂鸦</button>
      <button onClick={deleteBrush}>删除涂鸦</button>
      <button onClick={backBrush}>撤销删除</button>
      <button onClick={handleDelete}>删除当前选中图形</button>
      <button onClick={handleText}>编辑文字</button>
      <button onClick={handleImage}>生成图片</button>
      <button onClick={() => app?.back()}>回退</button>
      <button onClick={() => app?.revoke()}>撤销回退</button>
      <button onClick={() => {
        app?.clearCanvas();
        setTimeout(() => {
          app?.setScale(true);
          img && app?.add(img);
          gra && app?.add(gra);

        }, 1000);
      }}>展示刻度</button>
      <div id="canvas-container" style={{ width: '100%', height: '90vh', position: 'relative' }} />
    </div>
  )
}

export default Demo;