import { ShapeType } from './canvas';

export const uuid = (): string => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};

export  const isPosInRotationRect = (
  point: { x: number, y: number },
  shape: any,
  hornRadinCenter?: { x: number, y: number }
)  => {
  let hw = shape.width / 2;
  let hh = shape.height / 2
  let radian = shape.radian;
  let center = shape.position;
  let X = point.x;
  let Y = point.y;
  const angle = radian * 180 / Math.PI;
  let r = -angle * Math.PI/180;
  // 当前点击图形上四个顶角和旋转框框时，旋转的中心不是自己的中心的点，而是四个顶角的父级中心点
  const radianCenter = hornRadinCenter && radian ? hornRadinCenter : center;
  // 求旋转到回来后的点坐标
  let nTempX = radianCenter.x + (X - radianCenter.x) * Math.cos(r) - (Y - radianCenter.y) * Math.sin(r);
  let nTempY = radianCenter.y + (X - radianCenter.x) * Math.sin(r) + (Y - radianCenter.y) * Math.cos(r);
  if (nTempX > center.x - hw && nTempX < center.x + hw && nTempY > center.y - hh && nTempY < center.y + hh) {
    return true;
  }
  return false
}

export const Reverse = (data: any,i: number) => { // 反色滤镜
  const red = data[i];
  const green = data[i+1];
  const blue = data[i+2];
  data[i] = 255 - red;
  data[i+1] = 255 - green;
  data[i+2] = 255 - blue;
}

export const BackWhite = (data: any, i: number) => { // 黑白滤镜
  // rgba r = data[i], g = data[i + 1], b = data[i + 2], a = data[i+3] 4个元素为一组
  const red = data[i];
  const green = data[i+1];
  const blue = data[i+2];
  let result = 0
  const average = Math.floor((red + green + blue) / 3);
  if(average > 255/2){
    result = 255;
  }else{
    result = 0;
  }
  data[i] = data[i+1] = data[i+2] = result;
}

export const Relief = (data: any, i: number, width: number) => { // 浮雕
  data[i] = 255 / 2 // 平均值
  + 2 * data[i] // 当前像素值 * 2
  - data[i + 4] // 下一个像素当前分量值
  - data[i + width * 4] // 下一行像素当前分量值，width为实际图片宽度
}

export const Grey = (data: any, i: number) => { // 灰色滤镜
  const grey = (data[i] + data[i+1] + data[i + 2]) / 3;
  data[i] = grey;
  data[i + 2] = grey;
  data[i + 2] = grey;
}

export const Red = (data: any, i: number) => { // 红色滤镜
  // data[i] = 255;
  data[i + 1] = 0;
  data[i + 2] = 0;
}

export const Vague = (options: any) => { // 模糊
  const { data, degree = 1, width, height } = options;
  const blurR = degree;
  const totalnum = (2 * blurR + 1) * (2 * blurR + 1);
  for(let i = blurR; i < height - blurR; i++){
    for(let j = blurR; j < width - blurR; j++){
      let totalr = 0, totalg = 0, totalb = 0;
      for(let dx = -blurR; dx <= blurR; dx++){
        for(let dy = -blurR; dy <= blurR; dy++){
          let x = i + dx;
          let y = j + dy;
          let p = x * width + y;
          totalr += data[p*4+0];
          totalg += data[p*4+1];
          totalb += data[p*4+2];
        }
      }
      const p = i * width + j;
      data[p*4+0] = totalr / totalnum;
      data[p*4+1] = totalg / totalnum;
      data[p*4+2] = totalb / totalnum;
    }
  }
}

export const Mosaic = (options: any) => { // 马赛克
  const { data, degree = 1, width, height } = options;
  const size = degree;
  const totalnum = size * size;
  for(let i = 0; i < height; i+=size){
    for(let j = 0; j < width; j+=size){
      let totalr = 0, totalg = 0, totalb = 0;
      for(let dx = 0; dx < size; dx++){
        for(let dy = 0; dy < size; dy++){
          const x = i + dx;
          const y = j + dy;
          const p = x * width + y;
          totalr += data[p*4+0];
          totalg += data[p*4+1];
          totalb += data[p*4+2];
        }
      }
      let p = i * width + j;
      const resr = totalr / totalnum;
      const resg = totalg / totalnum;
      const resb = totalb / totalnum;
      for(let dx = 0; dx < size; dx++){
        for(let dy = 0; dy < size; dy++){
          const x = i + dx;
          const y = j + dy;
          p = x * width + y;
          data[p*4+0]= resr;
          data[p*4+1]= resg;
          data[p*4+2]= resb;
        }
      }
    }
  }
}

export const sortShape = (data: ShapeType[], current: ShapeType) => {
  const sortData = data.sort((a, b) => (a.level || 0) - (b.level || 0));
  const maxLevel = sortData[sortData.length - 1].level;
  const maxCurrent: ShapeType = Object.assign(current, { level: maxLevel || 10000 });
  const list = sortData.filter((item) => {
    Object.assign(item, {
      level: (item.level || 0) - 1,
    });
    return item.uuid !== current.uuid;
  });
  list.push(maxCurrent);
  return list;
}
