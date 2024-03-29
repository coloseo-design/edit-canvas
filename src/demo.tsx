// import React, { useEffect } from "react";
// import DragCanvas, { Image as ImageRect, Rect, Line, Text } from './index';
// import { useNavigate } from 'react-router-dom'; 

// export default () => {
//   const [conext, $context] = React.useState<DragCanvas>();
//   const [filter, $filter] = React.useState('');
//   const [imgae, $imgae] = React.useState<ImageRect>();
//   const [imgae1, $imgae1] = React.useState<ImageRect>();
//   const [line, $line] = React.useState<Line>();
//   const [text, $text] = React.useState<Text>();
//   const [rect, $rect] = React.useState<Rect>();

//   const barData = (from: any, to: any, xLength: number) => {
//     const width = 40;
//     const gap = 20;
//     const axiosX = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
//     const maxScaleYValue = to.y - from.y;
//     const gapY = 50;
//     const scaleYList = Array.from({ length: Math.ceil(maxScaleYValue / gapY) + 1 }).map((_, index) => {
//       const val = index * gapY;
//       return {
//         value: val.toString(),
//         x: from.x - 20,
//         y: to.y - val - 6,
//         font: '12px serif',
//         lineFrom: { x: from.x, y: to.y - val },
//         lineTo: { x: from.x + xLength, y: to.y - val },
//       }
//     });
//     const list = Array.from({ length: 7 }).map((_, index) => {
//       const height = 35 * (index + 1);
//       const x = from.x + index * width + (index + 1) * gap;
//       const y = to.y - height;
//       const scaleX = { x: from.x + index * gap + index * width + (index == 0 ? 0 : gap / 2), y: to.y };
//       const scaleY = { x: from.x + index * gap + index * width + (index == 0 ? 0 : gap / 2), y: to.y + 8 };
//       return {
//         x,
//         y,
//         width,
//         height,
//         textX: x + width / 3,
//         textY: y - 16,
//         textVal: (40 * (index + 1)).toString(),
//         font: '12px serif',
//         axiosXVal: axiosX[index],
//         axiosXY: to.y + 18,
//         scaleX,
//         scaleY,
//       };
//     });
//     return {
//       main: list || [],
//       scaley: scaleYList || [],
//     };
//   }


//   React.useEffect(() => {
//     const canvasEle = document.getElementById('canvas') as HTMLCanvasElement;
//     if (canvasEle) {
//       const canvas = new DragCanvas(canvasEle);
//       $context(canvas);
//       const i = new ImageRect({
//         x: 50,
//         y: 50,
//         height: 250,
//         width: 250,
//         src: require('./assets/3.jpg'),
//         filter: '单色',
//       });
//       const i1 = new ImageRect({
//         x: 350,
//         y: 50,
//         height: 150,
//         width: 150,
//         src: require('./assets/test.jpg'),
//       });

//       const r = new Rect({
//         x: 50,
//         y: 500,
//         height: 300,
//         width: 300,
//         backgroundColor: 'pink',
//       })

//       const t = new Text({ x: 700, y: 100, value: '呵呵呵123', color: 'black', font: '24px serif' }); // 一个实例只能画一段文案
//       $imgae(i);
//       $imgae1(i1);
//       $text(t);
//       $rect(r);
//       canvas.add(i);
//       canvas.add(i1);
//       canvas.add(t);
//       canvas.add(r);



//       // 柱状图

//       // 坐标轴
//       const xForm = { x: 480, y: 300 };
//       const xTo = { x: 480, y: 600 };
//       const yForm = { x: 480, y: 600 };
//       const yTo = { x: 950, y: 600 };
//       canvas.add(new Line({
//         from: xForm,
//         to: xTo,
//         lineWidth: 1,
//       })); // y轴坐标
//       canvas.add(new Line({
//         from: yForm,
//         to: yTo,
//         lineWidth: 1,
//       })); // x轴坐标

//       const { main: barList, scaley } = barData(xForm, xTo, yTo.x - yForm.x);
//       scaley.forEach((item, index) => {
//         canvas.add(new Text({
//           x: item.x,
//           y: item.y,
//           value: item.value,
//           font: item.font,
//           isOperation: false,
//         })); // y轴文字
//         index !== 0 && canvas.add(new Line({ // 除去坐标轴那一条线
//           from: item.lineFrom,
//           to: item.lineTo,
//           color: '#DCDFE6',
//         })); // y轴网格线
//       });

//       barList.forEach((item) => {
//         canvas.add(new Rect({
//           x: item.x,
//           y: item.y,
//           width: item.width,
//           height: item.height,
//           backgroundColor: 'green',
//           isOperation: false,
//         }));// 柱子
//         canvas.add(new Text({
//           x: item.textX,
//           y: item.textY,
//           value: item.textVal,
//           font: item.font,
//           isOperation: false,
//         })); // 柱子上的文字
//         canvas.add(new Text({
//           x: item.textX,
//           y: item.axiosXY,
//           value: item.axiosXVal,
//           font: item.font,
//           isOperation: false,
//         })); // x轴文字
//         canvas.add(new Line({
//           from: item.scaleX,
//           to: item.scaleY,
//         }));// x轴刻度
//       });
//     }
//   }, []);


//   const handleBack = () => {
//     // 传值代表回退的步数 back不传值默认回退一步，传值大于操作步数回到最初状态
//     // conext.back(3);
//     conext?.back();
//   };

//   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = event.target.value;
//     $filter(value);
//     const degree = value.indexOf('轻度') >= 0 ? 2 : 12;
//     if (value.indexOf('模糊') >= 0 || value.indexOf('马赛克') >= 0) {
//       imgae?.filters(value.slice(2), degree);
//     } else {
//       imgae?.filters(value);
//     }
//   }

//   const handleWrite = () => {
//     // text?.writeText();
//     const temp = new Text({
//       x: 0, y: 0,
//       value: '哈哈哈哈哈哈哈哈哈1234',
//       color: 'green', font: '36px serif',
//       textAlign: 'center',
//     });
//     conext?.add(temp);
//   }

//   const handleDelete = () => {
//     imgae && conext?.remove(imgae);
//     line && conext?.remove(line);
//     text && conext?.remove(text);
//     rect && conext?.remove(rect);
//     // conext?.clear();
//   }

//   const handleRect = () => {
//     if (rect) {
//       rect.backgroundColor = 'yellow';
//       rect.paint();
//     }
//   };

//   const navigate = useNavigate();
//   return (
//     <>
//       <button
//         onClick={() => {
//           navigate('/', { replace: true })
//         }}
//       >
//         跳转 另一个demo
//       </button>
//       <div style={{ display: 'flex' }}>
//         <canvas id="canvas" width="1000" height="700" style={{ border: '1px solid red' }}></canvas>
//         <div style={{ marginRight: 16 }}>
//           <button onClick={handleBack}>
//             <img src={require('./assets/back.svg')} style={{ width: 20, height: 20 }} />
//           </button>
//           <button onClick={handleWrite}>
//             <img src={require('./assets/text.svg')} style={{ width: 20, height: 20 }} />
//           </button>
//           <button onClick={handleRect}>修改背景色</button>
//           <div style={{ display: 'flex' }}>
//             <p>选择滤镜:</p>
//             <select style={{ height: 28, width: 156, marginTop: 14 }} value={filter} onChange={handleChange} >
//               <option value=""></option>
//               <option value="反色">反色滤镜</option>
//               <option value="黑白">黑白滤镜</option>
//               <option value="浮雕">浮雕滤镜</option>
//               <option value="灰色">灰色滤镜</option>
//               <option value="单色">单色滤镜</option>
//               <option value="轻度模糊">轻度模糊</option>
//               <option value="轻度马赛克">轻度马赛克</option>
//               <option value="重度模糊">重度模糊</option>
//               <option value="重度马赛克">重度马赛克</option>
//             </select>
//           </div>
//           <button onClick={handleDelete}>删除</button>
//         </div>
//       </div>
//     </>
//   );
// };

import React from 'react';
import * as PIXI from 'pixi.js';

export default () => {
  React.useEffect(() => {
// 初始化PIXI应用程序
const map = document.getElementById('map');
if (map) {
  const app = new PIXI.Application(
    {
      width: map.clientWidth,
      height: map.clientHeight,
      backgroundColor: 0xffffff,
      resolution: 2,
      antialias: true, // 抗锯齿
      autoDensity: true,
      transparent: true,
    }
  );
  map.appendChild(app.view);
  app.renderer.transparent = true;
  console.log('=>>app.render', app.renderer);
   
  // 创建曲线路径对象
  const path = new PIXI.Graphics();
  path.lineStyle(1); // 设置线条样式（如果需要）
  path.moveTo(0, 50); // 移动到起点位置
  path.quadraticCurveTo(300, -80, 600, 400); // 添加二次贝塞尔曲线
  console.log('曲线面积为', path);
   
  // 将曲线添加到舞台
  app.stage.addChild(path);
}
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ width: 500, height: 500, background: 'red' }}>

      </div>
      <div id="map" style={{ width: 480, height: 500, position: 'absolute', top: 0, left: 0 }}></div>
    </div>
  )
}
 

