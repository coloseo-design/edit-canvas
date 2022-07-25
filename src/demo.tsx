import React from "react";
import DragCanvas from './canvas';
import type { DragCanvasType } from './canvas';

export default () => {
  const img = new Image();
  img.src = require('./assets/test.jpg');

  const img1 = new Image();
  img1.src= require('./assets/test.png');

  const t3 = new Image();
  t3.src= require('./assets/3.jpg');
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
        width: 250,
        height: 250,
        img: t3,
      });
      canvasConsext.createImage({
        x: 350,
        y: 10,
        width: 130,
        height: 150,
        img: img1,
      });
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
    const degree = value.indexOf('轻度') >= 0 ? 2 : 4;
    if (value.indexOf('模糊') >= 0 || value.indexOf('马赛克') >= 0) {
      conext?.filter(value.slice(2), degree);
    } else {
      conext?.filter(value);
    }
  }

  const handlePaint = () => {
    conext?.paintBrush({ color: 'blue', lineWidth: 2 });
  }

  const handleWrite = () => {
   conext?.addWrite({ font: '24px serif', color: 'blue' });
  }

  const handleWriteEdit = () => {
    conext?.editWrite();
  }

  const handleBig = () => {

  }

  return (
    <div style={{ display: 'flex' }}>
      <canvas id="canvas" width="1000" height="1800" style={{ border: '1px solid red', position: 'absolute', top: 0, left: 0 }}></canvas>
      <div style={{ marginRight: 16 }}>
        <button onClick={handleBack}>
          <img src={require('./assets/back.svg')} style={{ width: 20, height: 20 }} />
        </button>
        <button onClick={handleWrite}>
          <img src={require('./assets/text.svg')} style={{ width: 20, height: 20 }} />
        </button>
        <button onClick={handleWriteEdit}>
          <span>编辑文字</span>
          <img src={require('./assets/edit.svg')} style={{ width: 20, height: 20 }} />
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
      </div>
    </div>
  );
};
