import React from "react";
import DragCanvas from './canvas';

export default () => {
  const [conext, $context] = React.useState(null);
  React.useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    // const canvas1 = document.getElementById('canvas1') as HTMLCanvasElement;
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
    if (canvas) {
      const canvasConsext = new DragCanvas(canvas); 
      $context(canvasConsext);
      canvasConsext.createImage({
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        img,
      });
      canvasConsext.createImage({
        x: 300,
        y: 10,
        width: 200,
        height: 250,
        img: img1,
      });
      canvasConsext.createImage({
        x: 600,
        y: 10,
        width: 100,
        height: 90,
        img: t1,
      });
      canvasConsext.createImage({
        x: 50,
        y: 520,
        width: 200,
        height: 250,
        img: t2,
      });
      canvasConsext.createImage({
        x: 550,
        y: 510,
        width: 200,
        height: 250,
        img: t4,
        radian: 35,
      });
      canvasConsext.createRect({
        x: 20,
        y: 350,
        width: 160,
        height: 160,
        color: 'blue',
      });

    }
  }, []);

  const handleBack = () => {
    if (conext) {
      // back不传值默认回退一步，传值大于操作步数回到最初状态
      // conext.back(3);
      conext.back(1);
    }
  };

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
      </div>
    
    </div>
  );
};
