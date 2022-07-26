## API

const context = new DragCanvas(canvas: HTMLCanvasElement);
滤镜方法 context.filter(type: '反色', '黑白', '浮雕', '灰色', '单色', '模糊', '马赛克', degree: number) => void; 当传值为马赛克和模糊时，第二个参数degree数值越大，越模糊马赛克越明显，传其他值时不需要传degree (滤镜如果不选中图片，默认用在第一张图片上)

画笔方法 context.paintBrush({ color: string, linewidth: number }) => void; color 画笔颜色， linewidt画线的宽度

回退方法 context.back(step?: number = 1) => void; 回退到之前的操作，默认回退一步

增加文案方法 context.addWrite(font: string, color: string) => void; font 文字大小和字体， 触发之后第一次点击到画布就是文案的位置

编辑文字方法 context.editWrite(); 触发之后可以编辑context.addWrite()新增的所有文案



### createImage属性说明
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | ---    |
|x|x轴坐标|number|--|
|y|y轴坐标|number|--|
|width|图片宽度|number|--|
|height|图片高度|number|--|
|img|图片 new Imgae()生产的图片，需要赋值src| --|
|filter|图片滤镜, 传值为||--|
|radian|图片旋转的弧度｜number|0|

### createRect属性说明
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | ---    |
|x|x轴坐标|number|--|
|y|y轴坐标|number|--|
|width|图片宽度|number|--|
|height|图片高度|number|--|
|color|矩形框的边框颜色|string|--|
|radian|图片旋转的弧度｜number|0|


