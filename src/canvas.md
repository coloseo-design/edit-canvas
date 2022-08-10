## API

const context = new DragCanvas(canvas: HTMLCanvasElement);

回退方法 context.back(step?: number = 1) => void; 回退到之前的操作，默认回退一步
增加图形实例 context.add(); 添加 Line实例，Image实例，Rect实例， Text实例
删除画布方法 context.clear();
删除实例引用方法 context.remove(Line |Image |Rect |Text)



### new Image
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | ---    |
|x|x轴坐标|number|--|
|y|y轴坐标|number|--|
|width|图片宽度|number|--|
|height|图片高度|number|--|
|src|图片url| string|--|
|filter|图片滤镜属性|'反色', '黑白', '浮雕', '灰色', '单色', '模糊', '马赛克'|--|
|filters|修改图片滤镜方法(当传值为'马赛克'和'模糊'时，第二个参数degree数值越大，越模糊马赛克越明显，传其他值时不需要传degree)| new Image.filters(type: '反色', '黑白', '浮雕', '灰色', '单色', '模糊', '马赛克', degree: number)| --|
|radian|图片旋转的弧度｜number|0|
|isOperation|图形是否可以操作(移动，变形)|boolean|true|

### new Rect
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | ---    |
|x|x轴坐标|number|--|
|y|y轴坐标|number|--|
|width|图片宽度|number|--|
|height|图片高度|number|--|
|color|矩形框的边框颜色|string|--|
|radian|图片旋转的弧度｜number|0|
|isOperation|图形是否可以操作(移动，变形)|boolean|true|

### new Text
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | ---    |
|color|文字颜色|string|'black'|
|font|文字大小及字体|string|'20px serif'|
|isOperation|图形是否可以操作(移动，变形)|boolean|true|

### new Line
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | ---    |
|color|线条颜色|string|'black'|
|lineWidth|线条宽度| number|1|


