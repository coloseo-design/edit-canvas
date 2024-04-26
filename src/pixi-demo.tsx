import React, { useEffect, useState, useRef } from 'react';
import EditCanvas, { Image, Text, Graffiti, Graphics, Layer } from './components/index';;


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
        console.log('=image click>>', e);
      }
      image.onPointerdown = (e) => {
        console.log('=image down>>', e,);
      }
      image.onPointerup = (e) => {
        console.log('=image up>>', e,);
      }

      text1.onClick = (e) => {
        console.log('=>>text1 click', e);
      }

      text1.onPointerdown = (e) => {
        console.log('=text1 down>>', e,);
      }
      text1.onPointerup = (e) => {
        console.log('=text1 up>>', e,);
      }
    }

    return () => {
      canvasContainer && app.detach(canvasContainer);
    }
  }, []);

  const start = () => {
    const graffiti = new Graffiti();
    canvas.current?.add(graffiti);
    graffiti.onPointerdown = () => {
      console.log('==down');
    }
    graffiti.onPointerup = () => {
      console.log('==up', graffiti.getBoundRect(), graffiti);
    }
    ffis.push(graffiti);
    setFfi(ffis);
    canvas.current?.startGraffiti();
  }

  const end = () => {
    canvas.current?.endGraffiti();
  }

  const handleDelete = () => {
    const selected = canvas.current?.getSelectedGraphics();
    console.log('selel>', selected);
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
      // console.log('=55>>', fi);
      const boxGraffitiImg = await fi?.getImage(img.current);
      const graffitiImg = await fi?.getImage();
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
      // console.log('==src', src);
    }
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
      <button onClick={() => canvas.current?.back()}>回退</button>
      <br />
      <button onClick={() => canvas.current?.revoke()}>撤销回退</button>
      <br />
      <button onClick={handleAdd}>添加新的图层</button>
      <br />
      <button onClick={handleLayer}>生成图像外延图片</button>
      <button onClick={() => {
        canvas.current?.setIndex(text.current)
      }}>改变文字的层级</button>
      <br />
      <button onClick={() => {
        canvas.current?.clearCanvas();
      }}>清空画布</button>
      </div>
      <div id="canvas-container" style={{ flex: 1, height: '100%', position: 'relative' }} />
    </div>
  )
}

export default Demo;