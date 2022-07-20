import React from "react";
import DragCanvas from './canvas';
import type { DragCanvasType } from './canvas';

export default () => {
  const img = new Image();
  img.src = require('./assets/test.jpg');

  const img1 = new Image();
  img1.src= require('./assets/test.png');

  const t1 = new Image();
  t1.src= require('./assets/1.jpg');

  const t2 = new Image();
  t2.src= require('./assets/2.jpg');
  const t3 = new Image();
  t3.src= require('./assets/3.jpg');
  const t4 = new Image();
  t4.src= require('./assets/4.jpg');
  const [conext, $context] = React.useState<DragCanvasType>();
  const [filter, $filter] = React.useState('');
  React.useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas) {
      const canvasConsext = new DragCanvas(canvas); 
      $context(canvasConsext);
      canvasConsext.createImage({
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        img: t3, 
      });
      // canvasConsext.createImage({
      //   x: 300,
      //   y: 10,
      //   width: 200,
      //   height: 250,
      //   img: img1,
      // });
      // canvasConsext.createImage({
      //   x: 600,
      //   y: 10,
      //   width: 100,
      //   height: 90,
      //   img: t1,
      // });
      // canvasConsext.createImage({
      //   x: 50,
      //   y: 520,
      //   width: 200,
      //   height: 250,
      //   img: t2,
      // });
    }
  }, []);

  const handleBack = () => {
    if (conext) {
      // 传值代表回退的步数 back不传值默认回退一步，传值大于操作步数回到最初状态
      // conext.back(3);
      conext.back();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    $filter(value);
    conext && conext.filter(value);
  }

  const handlePaint = () => {
    conext && conext.paintBrush('blue');
  }


  return (
    <div style={{ display: 'flex' }}>
      <canvas id="canvas" width="800" height="1800" style={{ border: '1px solid red' }}></canvas>
      <div style={{ marginLeft: 32 }}>
        <button onClick={handleBack}>
          <img src={require('./assets/back.svg')} style={{ width: 20, height: 20 }} />
        </button>
        <button>
          <img src={require('./assets/text.svg')} style={{ width: 20, height: 20 }} />
        </button>
        <div style={{ display: 'flex' }}>
          <p>选择滤镜:</p>
          <select style={{ height: 28, width: 156, marginTop: 8 }} value={filter} onChange={handleChange} >
            <option value=""></option>
            <option value="反色">反色滤镜</option>
            <option value="黑白">黑白滤镜</option>
            <option value="浮雕">浮雕滤镜</option>
            <option value="灰色">灰色滤镜</option>
            <option value="单色">单色滤镜</option>
          </select>
        </div>
        <button onClick={handlePaint}>
          <img src={require('./assets/pen.svg')} style={{ width: 20, height: 20 }} />
        </button>
      </div>
    
    </div>
  );
};
