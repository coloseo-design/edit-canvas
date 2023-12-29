import { Application, Container, Graphics, Text, Sprite, Loader, BitmapFont, BitmapText, InteractionEvent } from "pixi.js";
import { getPoint } from './pixi-utils';
import CanvasStore from './store';
import EditText from './pixi-text';
import OperateRect from './pixi-operate';
import SelectorTool from './pixi-select';
import ScaleLine from './pixi-scale';


const wheelListener = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  const friction = 1;
  const event = e as WheelEvent;
  const deltaX = event.deltaX * friction;
  const deltaY = event.deltaY * friction;
  if (!event.ctrlKey) { // 滚轮移动
    CanvasStore.moveCamera(deltaX, deltaY);
  } else { // 缩放
    CanvasStore.zoomCamera(deltaX, deltaY);
  }
};

const pointerListener = (event: PointerEvent) => {
  CanvasStore.movePointer(event.offsetX, event.offsetY);
};

const operate = new OperateRect({});
class Canvas {
  public isTouch: boolean = false;
  public GraphicsList: any[] = [];
  private add(item: any) {
    this.GraphicsList.push(item);
  }

  public boundary: number = 20000;

  public gap: number = 100;

  private drawCanvas() {
    const container = new Container();
    const mid = new EditText({
      style: {
        fontSize: 30,
        fill: 0x000000,
        fontWeight: "900",
        wordWrap: true,
      },
      value: '中心点',
      position: {
        x: 600,
        y: 230,
      },
      container,
      operate,
    });

    this.add(mid);

    const start = new EditText({
      style: {
        fontSize: 20,
        fill: 0x000000,
      },
      value: '起点',
      position: {
        x: 30, y: 30,
      },
      container,
      operate,
    });

    this.add(start);
    return container;
  }
  attach(root: HTMLElement) {
    CanvasStore.initialize(
      root.clientWidth,
      root.clientHeight,
    );
    const app = new Application({
      width: root.clientWidth,
      height: root.clientHeight,
      backgroundColor: 0xf3f3f3,
      resolution: 2,
      antialias: true, // 抗锯齿
      autoDensity: true,
      // resizeTo: window,
    });
    operate.child = root;

    root.appendChild(app.view);
    root.onpointerup = () => {
      operate.isDrag = false;
    }

    const top = new ScaleLine({ width: root.clientWidth });
    const canvas = this.drawCanvas();
    canvas.addChild(operate.main);
    canvas.addChild(operate.leftTop);
    canvas.addChild(operate.rightTop);
    canvas.addChild(operate.leftBottom);
    canvas.addChild(operate.rightBottom);

    app.stage.addChild(canvas);
    app.stage.addChild(top.topContainer);
    app.stage.addChild(top.leftContainer);

    operate.GraphicsList = this.GraphicsList;

    let select: any;
    let list: any[] = [];


    app.renderer.plugins.interaction.on('pointerdown', (e: InteractionEvent) => {
      if (e.target) {
        if (['leftTop', 'leftBottom', 'rightTop', 'rightBottom', 'main'].includes(e.target.name)) {
          operate.hornDown(e.target.name, e);
        }
      } else { // 框选
        const startPosition = getPoint(e);
        const stagePos = app.stage.localTransform.clone().applyInverse(startPosition);
        this.isTouch = true;
        select = new SelectorTool(canvas, stagePos);
        operate.multi = true;
        operate.clear(); // 点击空白处
      }
    });
    app.renderer.plugins.interaction.on('pointermove', (e: InteractionEvent) => {
      if (this.isTouch && select) {
        const scalePosition = getPoint(e);
        select.move(app.stage.localTransform.clone().applyInverse(scalePosition))
      }
    })
    app.renderer.plugins.interaction.on('pointerup', (e: InteractionEvent) => {
      this.isTouch = false;
      operate.isDrag = false;
      (this.GraphicsList || []).forEach((item) => {
        if (typeof item.isDrag !== 'undefined') {
          item.isDrag = false;
        }
      })
      if (select) {
        list = select.end();
        if (list.length > 0) {
          const { x, y, width, height } = select.rect.getLocalBounds();
          operate.clear();
          operate.originW = width;
          operate.originH = height;
          operate.x = x;
          operate.y = y;
          operate.width = width;
          operate.height = height;
          operate.originX = x;
          operate.originY = y;
          operate.paint({ x, y, width, height }, true);
          list.forEach((item) => {
            operate.main.addChild(item);
          });
          select.rect.clear();
          canvas.removeChild(select.rect);
          select = null;
        }
      } else {
        (operate.main.children || []).forEach((item) => {
          operate.main.removeChild(item);
          canvas.addChild(item);
        });
        if (operate.multi) {
          list = [];
          operate.clear();
          operate.multi = false;
        }
      }
      operate.hornUp(e);
    });

    // 监听帧更新

    app.ticker.add(() => {
      const { x, y } = CanvasStore.screen;
      const { x: scaleX, y: scaleY } = CanvasStore.scale;
      canvas.position.set(-scaleX * x, -scaleY * y);
      canvas.scale.set(scaleX, scaleY);
    });

    root.addEventListener("mousewheel", (e: any) => {
      const { x, y, width, height } = CanvasStore.screen;
      const { x: scaleX, y: scaleY } = CanvasStore.scale;
      if (!e.ctrlKey) {
        const lenX = Math.ceil(width / top.gap);
        const lenY = Math.ceil(height / top.gap);
        top.topContainer.position.set(-scaleX * x, 0);
        top.leftContainer.position.set(0, -scaleY * y);
        // 横向滚动
        if (x > 0) {
          if (e.deltaX >= 0 && x > top.swipeList[1][lenX - 1].start) {
            top.paintX(top.swipeList[1][lenX - 1].start, top.gap);
          }
          if (e.deltaX < 0 && x < top.swipeList[0][lenX - 1].start) {
            top.paintX(top.swipeList[0][lenX - 1].start, top.gap);
          }
        } else {
          if (e.deltaX <= 0 && Math.abs(x) > Math.abs(top.swipeList[0][0].start)) {
            top.paintX(top.swipeList[0][0].start, top.gap);
          }
          if (e.deltaX > 0 && x > top.swipeList[1][lenX - 1].start) {
            top.paintX(top.swipeList[1][lenX - 1].start, top.gap);
          }
        }

        // 竖向滚动
        if (y > 0) {
          if (e.deltaY >= 0 && y > top.verticalSwipes[1][lenY - 1].start) {
            top.paintY(top.verticalSwipes[1][lenY - 1].start, top.gap);
          }
          if (e.deltaY < 0 && y < top.verticalSwipes[0][lenY - 1].start) {
            top.paintY(top.verticalSwipes[0][lenY - 1].start, top.gap);
          }
        } else {
          if (e.deltaY <= 0 && Math.abs(y) > Math.abs(top.verticalSwipes[0][0].start)) {
            top.paintY(top.verticalSwipes[0][0].start, top.gap);
          }
          if (e.deltaY > 0 && y > top.verticalSwipes[1][lenY - 1].start) {
            top.paintY(top.verticalSwipes[1][lenY - 1].start, top.gap);
          }
        }
      } else {  // 缩放
        const gap = Math.ceil(this.gap * scaleX);
        top.gap = gap;
        top.paintX(0, gap);
        top.paintY(0, gap);
        console.log('=>>', top.topContainer.children, top.leftContainer.children);
      }
      wheelListener(e)
    }, { passive: false });
    root.addEventListener("pointermove", (e) => {
      pointerListener(e);
    }, {
      passive: true,
    });
  }
  detach(root: HTMLElement) {
    root.removeEventListener("mousewheel", wheelListener);
    root.removeEventListener("pointermove", pointerListener);
  }
}

export default Canvas;