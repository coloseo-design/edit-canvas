export const uuid = (): string => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};

export const Reverse = (data: any,i: number) => {
  const red = data[i];
  const green = data[i+1];
  const blue = data[i+2];
  data[i] = 255 - red;
  data[i+1] = 255 - green;
  data[i+2] = 255 - blue;
}

export const BackWhite = (data: any, i: number) => {
  // rgba r = data[i], g = data[i + 1], b = data[i + 2], a = data[i+3]

  const red = data[i];
  const green = data[i+1];
  const blue = data[i+2];
  let result = 0
  const average = Math.floor((red+green+blue)/3);
  if(average > 255/2){
    result = 255;
  }else{
    result = 0;
  }
  data[i] = data[i+1] = data[i+2] = result;
}

export const Relief = (data: any, i: number, width: number) => {
  data[i] = 255 / 2 // 平均值
  + 2 * data[i] // 当前像素值 * 2
  - data[i + 4] // 下一个像素当前分量值
  - data[i + width * 4] // 下一行像素当前分量值，width为实际图片宽度
}

export const Grey = (data: any, i: number) => {
  const grey = (data[i] + data[i+1] + data[i + 2]) / 3;
  data[i] = grey;
  data[i + 2] = grey;
  data[i + 2] = grey;
}

export const Red = (data: any, i: number) => {
  data[i * 4] = 255;
  data[i * 4 + 1] = 0;
  data[i * 4 + 2] = 0;
}
