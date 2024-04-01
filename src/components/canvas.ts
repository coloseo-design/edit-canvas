import { Application, Container, InteractionEvent } from "pixi.js";
import { getBoundRect, exportImage } from './utils';
import CanvasStore from './store';
import OperateRect from './operate';
import ScaleLine from './scale';
import Graffiti from './graffiti';

export type positionType = { x: number; y: number };


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
  private mainContainer: Container = new Container();
  private root: HTMLElement | null = null;
  private isDown: boolean = false;
  private rod: any
  private temStartX: number = 0;
  private temStartY: number = 0;
  private selected: any;
  private GraffitiContainer: Container = new Container;
  public isGraffiti: boolean = false;
  private GraffitiList: Graffiti[] = []; // 所有的存在的涂鸦
  private cacheGraffitiList: Graffiti[] = []; // 缓存当前画笔下的涂鸦
  public showScale: boolean = false;


  private setIndex = (target: any, parent: any) => {
    if (parent?.children.length > 0) {
      parent.setChildIndex(target, parent.children.length - 1);
    }
  }
  private pointerDown = (e: InteractionEvent) => {
    if (this.isGraffiti && this.GraffitiList.length) {
      this.isDown = true;
      const currentP = this.GraffitiList[this.GraffitiList.length - 1];
      const item = new Graffiti({ color: currentP.color, lineWidth: currentP.lineWidth, alpha: currentP.alpha });
      item.operate = operate;
      item.app = this;
      item.container = currentP.brush;
      currentP.brush.addChild(item.brush);
      (currentP?.children || []).push(item);
      item.paint(e);
    } else if (e.target) {
      e.stopPropagation();
      this.selected = e.target;
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
  private appOperate = () => {
    if (this.app && this.mainContainer) {
      this.app.renderer.plugins.interaction.on('pointerdown', this.pointerDown);
      this.app.renderer.plugins.interaction.on('pointermove', (e: InteractionEvent) => {
        if (this.isDown) {
          const currentP = this.GraffitiList[this.GraffitiList.length - 1];
          if (currentP?.children.length) {
            const item = currentP.children[currentP.children.length - 1];
            item.paint(e);
          }
        }
      })
      this.app.renderer.plugins.interaction.on('pointerup', (e: InteractionEvent) => {
        e.stopPropagation();
        if (e.target) (e.target as any).isDrag = false;
        operate.isDrag = false;
        operate.hornUp();
        this.isDown = false;
      });
    }
  }
  private rootOperate = () => {
    let lastScrollTime: any | null = null; // 保存上次滚动事件的时间戳
    const scrollThreshold = 100;
    if (this.root && this.rod) {
      this.root.addEventListener("mousewheel", (e: any) => {
        if (this.showScale) {
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

              this.temStartY = this.rod?.verticalSwipes[1][0].start;
              this.temStartX = this.rod?.swipeList[1][0].start;
            } else {  // 缩放  TODO
              const gap = scaleX < 1 ? Math.ceil((width / this.rod.countX)) : Math.ceil((width / this.rod.countX) * scaleX);
              this.rod.gap = gap;
              this.rod?.paintX?.(this.temStartX, gap);
              this.rod?.paintY?.(this.temStartY, gap);
              if (lastScrollTime !== null && (currentTime - lastScrollTime) < scrollThreshold) {
                // console.log("鼠标滚动");
              } else {
                // console.log("鼠标结束");
                // this.gap = gap;
                this.temStartY = this.rod.verticalSwipes[1][0].start;
                this.temStartX = this.rod.swipeList[1][0].start;
              }
              lastScrollTime = currentTime;
            }
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
  public clearCanvas = () => {
    (this.app?.stage?.children || []).forEach((i) => {
      this.app?.stage?.removeChild(i);
    })

  }
  public deleteGraffiti() {
    if (this.GraffitiList.length) {
      const deleteP = this.GraffitiList[this.GraffitiList.length - 1];
      if (deleteP.children.length) {
        const deleteItem = deleteP.children[deleteP.children.length - 1];
        if (deleteItem) {
          deleteP.children = deleteP.children.filter((i) => i !== deleteItem);
          deleteP.brush.removeChild(deleteItem.brush);
          const findP = this.cacheGraffitiList.find((i) => i.uuid === deleteP.uuid);
          if (findP) {
            Object.assign(findP, {
              children: [...findP.children, deleteItem],
            })
          } else {
            this.cacheGraffitiList.push({
              ...deleteP,
              children: [deleteItem],
            } as any)
          }
        }
      }
    }
  }

  public revokeGraffiti() {
    if (this.cacheGraffitiList.length) {
      const current = this.cacheGraffitiList[this.cacheGraffitiList.length - 1];
      if (current.children.length) {
        current.brush.addChild(current.children[current.children.length - 1].brush);
      }
    }
  }

  public getSelectedGraphics() {
    return this.selected;
  }
  public add(ele: any) {
    if (ele instanceof Graffiti) {
      this.getBrushParent();
      const gra = new Graffiti();
      gra.operate = operate;
      gra.app = this;
      this.GraffitiContainer.addChild(gra.brush);
      this.GraffitiList.push(gra);
      gra.brush.interactive = true;
      gra.container = this.GraffitiContainer;
    } else {
      ele.operate = operate;
      ele.container = this.mainContainer;
      ele.rootContainer = this.mainContainer;
      ele.rootDom = this.root;
      ele.app = this;
      ele.paint();
    }
  }
  public startGraffiti() { // 开始涂鸦
    this.isGraffiti = true;
    operate.clear();
    operate.isDrag = false;
    this.cacheGraffitiList = [];
  }
  public endGraffiti() { // 结束涂鸦
    this.isGraffiti = false;
    this.getBrushParent();
    this.cacheGraffitiList = [];
  }
  private getBrushParent() {
    if (this.GraffitiList.length) {
      const b = this.GraffitiList[this.GraffitiList.length - 1].brush; // 绘制当前涂鸦的父级
      const obj = getBoundRect(b);
      b.beginFill(0xffffff, 0);
      b.drawRect(obj.x, obj.y, obj.width, obj.height);
      b.endFill();
    }
  }
  public async  getImage(ele: any) {
    this.endGraffiti();
    return await exportImage(ele, this.GraffitiList, this.mainContainer, this.GraffitiContainer);

  }

  public setScale(show: boolean) {
    this.showScale = show;
    if (show) {
      this.app?.stage.addChild(this.rod?.topContainer);
      this.app?.stage.addChild(this.rod?.leftContainer);
      this.app?.ticker.add(() => {
        const { x, y } = CanvasStore.screen;
        const { x: scaleX, y: scaleY } = CanvasStore.scale;
        this.rod?.topContainer.position.set(-scaleX * x, 0);
        this.rod?.leftContainer.position.set(0, -scaleY * y);
      });
    } else {
      this.app?.stage.removeChild(this.rod?.topContainer);
      this.app?.stage.removeChild(this.rod?.leftContainer);
    }
  }

  public changeBgColor(color: number) {
    if (this.app) {
      this.app.renderer.backgroundColor = color;
    }
  }

  public attach(root: HTMLElement) {
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
      resizeTo: root,
    });
    this.app = app;
    root.appendChild(app.view);
    const top = new ScaleLine({ width: root.clientWidth });
    this.rod = top;

    this.mainContainer.addChild(operate.operateContainer);
    this.mainContainer.setChildIndex(operate.operateContainer, this.mainContainer.children.length - 1);

    this.appOperate();
    this.rootOperate();

    app.stage.addChild(this.mainContainer);
    app.stage.addChild(this.GraffitiContainer);

    // 监听帧更新

    app.ticker.add(() => {
      const { x, y } = CanvasStore.screen;
      const { x: scaleX, y: scaleY } = CanvasStore.scale;
      this.mainContainer.position.set(-scaleX * x, -scaleY * y);
      this.mainContainer.scale.set(scaleX, scaleY);

      this.GraffitiContainer.position.set(-scaleX * x, -scaleY * y);
      this.GraffitiContainer.scale.set(scaleX, scaleY);
    });
    this.temStartY = top.verticalSwipes[1][0].start;
    this.temStartX = top.swipeList[1][0].start;
  }
  public detach(root: HTMLElement) {
    root.removeEventListener("mousewheel", wheelListener);
    root.removeEventListener("pointermove", pointerListener);
  }
}

export default Canvas;