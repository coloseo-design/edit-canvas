import React from "react";
import DragCanvas, { Image as ImageRect, Rect, Line, Text } from './index';
import type { DragCanvasType, ImageType, RectType, LineType, TextType } from './index';

export default () => {
  const [conext, $context] = React.useState<DragCanvasType>();
  const [filter, $filter] = React.useState('');
  const [imgae, $imgae] = React.useState<ImageType>();
  const [imgae1, $imgae1] = React.useState<ImageType>();
  const [rect, $rect] = React.useState<RectType>();
  const [line, $line] = React.useState<LineType>();
  const [text, $text] = React.useState<TextType>();


  React.useEffect(() => {
    const canvasEle = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvasEle) {
      const canvas = new DragCanvas(canvasEle); 
      $context(canvas);
      const i = new ImageRect({
        x: 50,
        y: 50,
        height: 250,
        width: 250,
        src: require('./assets/3.jpg'),
      });
      const r = new Rect({
        x: 50,
        y: 350,
        height: 250,
        width: 250,
        color: 'red',
      });
      const i1 = new ImageRect({
        x: 350,
        y: 50,
        height: 150,
        width: 150,
        src: require('./assets/test.jpg'),
      });
      const l = new Line({ color: 'red' });
      const t = new Text({ color: 'blue', font: '24px serif', }); // 一个实例只能画一段文案
      $imgae(i);
      $imgae1(i1);
      $rect(r);
      $line(l);
      $text(t);
      canvas.add(i);
      canvas.add(i1);
      canvas.add(r);
      canvas.add(l);
      canvas.add(t);
    }
  }, []);


  const handleBack = () => {
      // 传值代表回退的步数 back不传值默认回退一步，传值大于操作步数回到最初状态
      // conext.back(3);
    conext?.back();
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    $filter(value);
    const degree = value.indexOf('轻度') >= 0 ? 2 : 12;
    if (value.indexOf('模糊') >= 0 || value.indexOf('马赛克') >= 0) {
      imgae?.filters(value.slice(2), degree);
    } else {
      imgae?.filters(value);
    }
  }

  const handlePaint = () => {
    line && line.paintBrush();
  }

  const handleWrite = () => {
  text?.writeText()
  }

  const handleBig = () => {
  }

  const handleDelete = () => {
    imgae && conext?.remove(imgae);
    rect && conext?.remove(rect);
    line && conext?.remove(line);
    text && conext?.remove(text);
  }

  return (
    <div style={{ display: 'flex' }}>
      <canvas id="canvas" width="1000" height="1800" style={{ border: '1px solid red' }}></canvas>
      <div style={{ marginRight: 16 }}>
        <button onClick={handleBack}>
          <img src={require('./assets/back.svg')} style={{ width: 20, height: 20 }} />
        </button>
        <button onClick={handleWrite}>
          <img src={require('./assets/text.svg')} style={{ width: 20, height: 20 }} />
        </button>
        <div style={{ display: 'flex' }}>
          <p>选择滤镜:</p>
          <select style={{ height: 28, width: 156, marginTop: 14 }} value={filter} onChange={handleChange} >
            <option value=""></option>
            <option value="反色">反色滤镜</option>
            <option value="黑白">黑白滤镜</option>
            <option value="浮雕">浮雕滤镜</option>
            <option value="灰色">灰色滤镜</option>
            <option value="单色">单色滤镜</option>
            <option value="轻度模糊">轻度模糊</option>
            <option value="轻度马赛克">轻度马赛克</option>
            <option value="重度模糊">重度模糊</option>
            <option value="重度马赛克">重度马赛克</option>
          </select>
        </div>
        <button onClick={handlePaint}>
          <img src={require('./assets/pen.svg')} style={{ width: 20, height: 20 }} />
        </button>
        <button onClick={handleBig}>
          <img src={require('./assets/big.svg')} style={{ width: 20, height: 20 }} />
        </button>
        <button onClick={handleDelete}>删除</button>
      </div>
    </div>
  );
};
