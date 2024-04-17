import React, { useEffect, useState } from 'react';
import EditCanvas, { Image, Text, Graffiti, Graphics, Layer } from './components/index';;


const Demo = () => {
  const [app, setApp] = useState<EditCanvas>();
  const [text, setText] = useState<Text>();
  const [img, setImg] = useState<Image>();
  const [img1, setImg1] = useState<Image>();
  const [gra, setGra] = useState<Graphics>();
  const [ffi, setFfi] = useState<Graffiti>();
  const [lay, setLay] = useState<Layer>()
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
      const image1 = new Image({
        url: 'http://47.109.84.94/file-1713170051377.jpg',
        position: {
          x: 20,
          y: 200,
        },
        width: 150,
        height: 250,
      })
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
      setImg1(image1);
      app.add(g);
      app.add(image);
      app.add(text1);
      app.add(image1);
      const graffiti = new Graffiti();
      app?.add(graffiti);
      setFfi(graffiti);
      image.onClick = (e) => {
        console.log('=image click>>', e);
      }
    }
    return () => {
      canvasContainer && app.detach(canvasContainer);
    }
  }, []);

  const start = () => {
    // const graffiti = new Graffiti();
    // app?.add(graffiti);
    app?.startGraffiti();
  }

  const end = () => {
    app?.endGraffiti();
  }

  const handleDelete = () => {
    const selected = app?.getSelectedGraphics();
    selected && selected.delete();
  }


  const handleText = () => {
    text?.writeText();
  }

  const handleImage =  async () => {
    if (app && img) {
      const image = img.getImage();
      const graffitiImg = await ffi?.getImage();
      const boxGraffitiImg = await ffi?.getImage(img);
      console.log('==>>底片', image);
      console.log('==>>涂鸦', graffitiImg);
      console.log('==>> 涂鸦与底片同大', boxGraffitiImg);
    }
  }

  const handleAdd = () => {
    const layer = new Layer({
      position: {
        x: 150,
        y: 150,
      },
      width: 350,
      height: 350,
    });
    app?.add(layer);
    setLay(layer);
  }

  const handleLayer = async () => {
    const src = await lay?.getImage();
    console.log('==src', src);
  };

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
      <button onClick={() => app?.back()}>回退</button>
      <br />
      <button onClick={() => app?.revoke()}>撤销回退</button>
      <br />
      <button onClick={handleAdd}>添加新的图层</button>
      <br />
      <button onClick={handleLayer}>生成图像外延图片</button>
      <button onClick={() => {
        app?.setIndex(text)
      }}>改变文字的层级</button>
      <br />
      <button onClick={() => {
        app?.clearCanvas();
        setTimeout(() => {
          app?.setScale(true);
          img && app?.add(img);
          gra && app?.add(gra);

        }, 1000);
      }}>展示刻度</button>
      </div>
      <div id="canvas-container" style={{ flex: 1, height: '100%', position: 'relative' }} />
    </div>
  )
}

export default Demo;