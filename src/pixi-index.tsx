import { Application, Container, Graphics, Text, Sprite, Loader, BitmapFont, BitmapText, InteractionEvent } from "pixi.js";
import { getPoint, getBoundRect } from './pixi-utils';
import CanvasStore from './store';
import EditText from './pixi-text';
import OperateRect from './pixi-operate';
import ScaleLine from './pixi-scale';
import EditGraphics from './pixi-graphics';


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
  public app: Application | null = null;
  public mainContainer: Container | null = null;
  public root: HTMLElement | null = null;

  public isDrag: boolean = false;

  public rod: any


  public gap: number = 100;

  public temStartX: number = 0;
  public temStartY: number = 0;


  public drawCanvas() {
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

    const contain = new EditGraphics({
      width: 750,
      height: 1000,
      background: 0xF5F6F6,
      position: {
        x: 130,
        y: 50,
      },
      rootContainer: container,
      container,
      name: 'contain',
      operate,
    });

    const header = new EditGraphics({
      width: 750,
      height: 88,
      background: 0xffffff,
      position: {
        x: 130,
        y: 50,
      },
      rootContainer: container,
      container: contain.graphics,
      operate,
      name: 'header',
    });

    Array.from({ length: 3 }).forEach((_, key) => {
      const ry = 158 + key * 209 + key * 20;
      const item = new EditGraphics({
        width: 702,
        height: 209,
        background: 0xffffff,
        shape: 'roundedRect',
        radius: 8,
        position: {
          x: 154,
          y: ry,
        },
        rootContainer: container,
        container: contain.graphics,
        operate,
      });
      const t1 = new EditText({
        style: {
          fontSize: 24,
          fontWeight: 400,
          fill: 0x646566,
        },
        position: {
          x: 154 + 32,
          y: ry + 32,
        },
        value: '2021/02/8  11:00~ 12:00',
        operate,
        container: item.graphics,
        rootContainer: container,
      });
      const t2 = new EditText({
        style: {
          fontSize: 32,
          fontWeight: 400,
          fill: 0x1C1D1D,
          wordWrap: true,
          wordWrapWidth: 640,
          breakWords: true,
        },
        rootContainer: container,
        position: {
          x: 154 + 32,
          y: ry + 32 + 16 + t1.text.height,
        },
        value: '会议标题会议标题会议标题会议标题会议标题会议标题会议标题题',
        operate,
        container: item.graphics,
      });
      const cx = 154 + 32 + 16;
      const r1 = new EditGraphics({
        shape: 'circle',
        radius: 16,
        position: {
          x: cx,
          y: ry + 32 + 32 + 16 + t1.text.height + t2.text.height,
        },
        background: 0xF72F48,
        container: item.graphics,
        rootContainer: container,
        operate,
      });
      const r2 = new EditGraphics({
        width: 62,
        height: 36,
        shape: 'roundedRect',
        radius: 4,
        position: {
          x: 760,
          y: ry + 32,
        },
        background: 0xED6A0C,
        container: item.graphics,
        rootContainer: container,
        operate,
      });
      const r2t = new EditText({
        style: {
          fontSize: 24,
          fontWeight: 400,
          fill: 0xffffff,
        },
        rootContainer: container,
        value: '修改',
        operate,
        container: r2.graphics,
        position: {
          x: 768,
          y: ry + 32 + 4,
        }
      })
      const t3 = new EditText({
        style: {
          fontSize: 12,
          fontWeight: 400,
          fill: 0xffffff,
        },
        rootContainer: container,
        value: '连琦',
        position: {
          x: cx - 12,
          y: ry + 32 + 32 + 8 + t1.text.height + t2.text.height ,
        },
        operate,
        container: r1.graphics
      });
    })

    const title = new EditText({
      style: {
        fontSize: 32,
        fontWeight: 600,
        fill: 0x1C1D1D,
        // lineHeight: 88,
      },
      value: '标题',
      position: {
        x: 440,
        y: 80,
      },
      operate,
      container: header.graphics,
      rootContainer: container,
    });

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
      rootContainer: container,
    });

    new EditGraphics({
      width: 200,
      height: 88,
      background: 0x00ff00,
      position: {
        x: 930,
        y: 50,
      },
      rootContainer: container,
      container,
      operate,
      name: 'test-graphical',
    })

    return container;
  }
  setIndex = (target: any, parent: any) => {
    if (parent?.children.length > 0) {
      parent.setChildIndex(target, parent.children.length - 1);
    }
  }
  pointerDown = (e: InteractionEvent) => {
    if (e.target) {
      e.stopPropagation();
      this.setIndex(e.target, e.target.parent); // 设置当前层级
      this.setIndex(operate.operateContainer, this.mainContainer); // 设置框架层级
      if (['leftTop', 'leftBottom', 'rightTop', 'rightBottom', 'main'].includes(e.target.name)) {
        operate.moveType = e.target.name;
        operate.hornDown(e.target.name, e);
      } else {
        operate.operateGraphical = e.target;
        operate.clear();
        operate.paint(getBoundRect(e.target));
      }
    }
  }
  appOperate = () => {
    if (this.app && this.mainContainer) {
      this.app.renderer.plugins.interaction.on('pointerdown', this.pointerDown);
      this.app.renderer.plugins.interaction.on('pointermove', (e: InteractionEvent) => {})
      this.app.renderer.plugins.interaction.on('pointerup', (e: InteractionEvent) => {
        e.stopPropagation();
        operate.hornUp();
      });
    }
  }
  rootOperate = () => {
    let lastScrollTime: any | null = null; // 保存上次滚动事件的时间戳
    const scrollThreshold = 100;
    if (this.root && this.rod) {
      this.root.addEventListener("mousewheel", (e: any) => {
        const { x, y, width } = CanvasStore.screen;
        const { x: scaleX } = CanvasStore.scale;
  
        const currentTime = new Date().getTime();
        if (Math.floor(scaleX * 100) >= 10 && width >= 50) {
          if (!e.ctrlKey) { // 滚动
            const lenX = this.rod?.countX || 15;
            const lenY = this.rod?.countY || 15;
    
            // 横向滚动
            if (x > 0) {
              if (e.deltaX >= 0 && x > this.rod?.swipeList[1][lenX - 1].start) {
                this.rod?.paintX(this.rod?.swipeList[1][lenX - 1].start, this.rod?.gap);
              }
              if (e.deltaX < 0 && x < this.rod?.swipeList[0][lenX - 1].start) {
                this.rod?.paintX(this.rod?.swipeList[0][lenX - 1].start, this.rod?.gap);
              }
            } else {
              if (e.deltaX <= 0 && Math.abs(x) > Math.abs(this.rod?.swipeList[0][0].start)) {
                this.rod?.paintX(this.rod?.swipeList[0][0].start, this.rod?.gap);
              }
              if (e.deltaX > 0 && x > this.rod?.swipeList[1][lenX - 1].start) {
                this.rod?.paintX(this.rod?.swipeList[1][lenX - 1].start, this.rod?.gap);
              }
            }
    
            // 竖向滚动
            if (y > 0) {
              if (e.deltaY >= 0 && y > this.rod?.verticalSwipes[1][lenY - 1].start) {
                this.rod?.paintY(this.rod?.verticalSwipes[1][lenY - 1].start, this.rod?.gap);
              }
              if (e.deltaY < 0 && y < this.rod?.verticalSwipes[0][lenY - 1].start) {
                this.rod?.paintY(this.rod?.verticalSwipes[0][lenY - 1].start, this.rod?.gap);
              }
            } else {
              if (e.deltaY <= 0 && Math.abs(y) > Math.abs(this.rod?.verticalSwipes[0][0].start)) {
                this.rod?.paintY(this.rod?.verticalSwipes[0][0].start, this.rod?.gap);
              }
              if (e.deltaY > 0 && y > this.rod?.verticalSwipes[1][lenY - 1].start) {
                this.rod?.paintY(this.rod?.verticalSwipes[1][lenY - 1].start, this.rod?.gap);
              }
            }
    
            this.temStartY= this.rod?.verticalSwipes[1][0].start;
            this.temStartX = this.rod?.swipeList[1][0].start;
          } else {  // 缩放  TODO
            const gap = scaleX < 1 ? Math.ceil((width / this.rod.countX)):  Math.ceil((width / this.rod.countX) * scaleX);
            this.rod.gap = gap;
            this.rod?.paintX?.(this.temStartX, gap);
            this.rod?.paintY?.(this.temStartY, gap);
            if (lastScrollTime !== null && (currentTime - lastScrollTime) < scrollThreshold) {
              // console.log("鼠标滚动");
            } else {
              // console.log("鼠标结束");
              this.gap = gap;
              this.temStartY= this.rod.verticalSwipes[1][0].start;
              this.temStartX = this.rod.swipeList[1][0].start;
            }
            lastScrollTime = currentTime;
          }
        }
        wheelListener(e);
      
      }, { passive: false });
      this.root.addEventListener("pointermove", (e) => {
        pointerListener(e);
      }, {
        passive: true,
      });
    }
  }
  attach(root: HTMLElement) {
    this.root = root;
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
    });
    this.app = app;
    root.appendChild(app.view);
    root.onpointerup = () => {
      operate.isDrag = false;
    }

    const top = new ScaleLine({ width: root.clientWidth });
    this.rod = top;
    const mainContainer = this.drawCanvas();
    this.mainContainer = mainContainer;

    mainContainer.addChild(operate.operateContainer);

    mainContainer.setChildIndex(operate.operateContainer, mainContainer.children.length - 1);

    this.appOperate();
    this.rootOperate();

    app.stage.addChild(mainContainer);
    app.stage.addChild(top.topContainer);
    app.stage.addChild(top.leftContainer);
    

    // 监听帧更新

    app.ticker.add(() => {
      const { x, y } = CanvasStore.screen;
      const { x: scaleX, y: scaleY } = CanvasStore.scale;
      mainContainer.position.set(-scaleX * x, -scaleY * y);
      mainContainer.scale.set(scaleX, scaleY);

      top.topContainer.position.set(-scaleX * x, 0);
      top.leftContainer.position.set(0, -scaleY * y);
    });

    this.temStartY= top.verticalSwipes[1][0].start;
    this.temStartX = top.swipeList[1][0].start;
  }
  detach(root: HTMLElement) {
    root.removeEventListener("mousewheel", wheelListener);
    root.removeEventListener("pointermove", pointerListener);
  }
}

export default Canvas;