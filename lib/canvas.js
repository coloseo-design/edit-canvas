"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var utils_1 = require("./utils");
var store_1 = require("./store");
var operate_1 = require("./operate");
var scale_1 = require("./scale");
var graffiti_1 = require("./graffiti");
var wheelListener = function (e) {
    e.preventDefault();
    e.stopPropagation();
    var friction = 1;
    var event = e;
    var deltaX = event.deltaX * friction;
    var deltaY = event.deltaY * friction;
    if (!event.ctrlKey) { // 滚轮移动
        store_1.default.moveCamera(deltaX, deltaY);
    }
    else { // 缩放
        store_1.default.zoomCamera(deltaX, deltaY);
    }
};
var pointerListener = function (event) {
    store_1.default.movePointer(event.offsetX, event.offsetY);
};
var operate = new operate_1.default({});
var Canvas = /** @class */ (function () {
    function Canvas() {
        var _this = this;
        this.app = null;
        this.mainContainer = new pixi_js_1.Container();
        this.root = null;
        this.isDown = false;
        this.temStartX = 0;
        this.temStartY = 0;
        this.GraffitiContainer = new pixi_js_1.Container;
        this.isGraffiti = false;
        this.GraffitiList = []; // 所有的存在的涂鸦
        this.cacheGraffitiList = []; // 缓存当前画笔下的涂鸦
        this.showScale = false;
        this.setIndex = function (target, parent) {
            if ((parent === null || parent === void 0 ? void 0 : parent.children.length) > 0) {
                parent.setChildIndex(target, parent.children.length - 1);
            }
        };
        this.pointerDown = function (e) {
            if (_this.isGraffiti && _this.GraffitiList.length) {
                _this.isDown = true;
                var currentP = _this.GraffitiList[_this.GraffitiList.length - 1];
                var item = new graffiti_1.default({ color: currentP.color, lineWidth: currentP.lineWidth, alpha: currentP.alpha });
                item.operate = operate;
                item.app = _this;
                item.container = currentP.brush;
                currentP.brush.addChild(item.brush);
                ((currentP === null || currentP === void 0 ? void 0 : currentP.children) || []).push(item);
                item.paint(e);
            }
            else if (e.target) {
                e.stopPropagation();
                _this.selected = e.target;
                _this.setIndex(e.target, e.target.parent); // 设置当前层级
                _this.setIndex(operate.operateContainer, _this.mainContainer); // 设置框架层级
                if (['leftTop', 'leftBottom', 'rightTop', 'rightBottom', 'main'].includes(e.target.name)) {
                    operate.moveType = e.target.name;
                    operate.hornDown(e.target.name, e);
                }
                else {
                    operate.operateGraphical = e.target;
                    operate.clear();
                    operate.paint((0, utils_1.getBoundRect)(e.target));
                }
            }
        };
        this.appOperate = function () {
            if (_this.app && _this.mainContainer) {
                _this.app.renderer.plugins.interaction.on('pointerdown', _this.pointerDown);
                _this.app.renderer.plugins.interaction.on('pointermove', function (e) {
                    if (_this.isDown) {
                        var currentP = _this.GraffitiList[_this.GraffitiList.length - 1];
                        if (currentP === null || currentP === void 0 ? void 0 : currentP.children.length) {
                            var item = currentP.children[currentP.children.length - 1];
                            item.paint(e);
                        }
                    }
                });
                _this.app.renderer.plugins.interaction.on('pointerup', function (e) {
                    e.stopPropagation();
                    if (e.target)
                        e.target.isDrag = false;
                    operate.isDrag = false;
                    operate.hornUp();
                    _this.isDown = false;
                });
            }
        };
        this.rootOperate = function () {
            var lastScrollTime = null; // 保存上次滚动事件的时间戳
            var scrollThreshold = 100;
            if (_this.root && _this.rod) {
                _this.root.addEventListener("mousewheel", function (e) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15;
                    if (_this.showScale) {
                        var _16 = store_1.default.screen, x = _16.x, y = _16.y, width = _16.width;
                        var scaleX = store_1.default.scale.x;
                        var currentTime = new Date().getTime();
                        if (Math.floor(scaleX * 100) >= 10 && width >= 50) {
                            if (!e.ctrlKey) { // 滚动
                                var lenX = ((_a = _this.rod) === null || _a === void 0 ? void 0 : _a.countX) || 15;
                                var lenY = ((_b = _this.rod) === null || _b === void 0 ? void 0 : _b.countY) || 15;
                                // 横向滚动
                                if (x > 0) {
                                    if (e.deltaX >= 0 && x > ((_c = _this.rod) === null || _c === void 0 ? void 0 : _c.swipeList[1][lenX - 1].start)) {
                                        (_d = _this.rod) === null || _d === void 0 ? void 0 : _d.paintX((_e = _this.rod) === null || _e === void 0 ? void 0 : _e.swipeList[1][lenX - 1].start, (_f = _this.rod) === null || _f === void 0 ? void 0 : _f.gap);
                                    }
                                    if (e.deltaX < 0 && x < ((_g = _this.rod) === null || _g === void 0 ? void 0 : _g.swipeList[0][lenX - 1].start)) {
                                        (_h = _this.rod) === null || _h === void 0 ? void 0 : _h.paintX((_j = _this.rod) === null || _j === void 0 ? void 0 : _j.swipeList[0][lenX - 1].start, (_k = _this.rod) === null || _k === void 0 ? void 0 : _k.gap);
                                    }
                                }
                                else {
                                    if (e.deltaX <= 0 && Math.abs(x) > Math.abs((_l = _this.rod) === null || _l === void 0 ? void 0 : _l.swipeList[0][0].start)) {
                                        (_m = _this.rod) === null || _m === void 0 ? void 0 : _m.paintX((_o = _this.rod) === null || _o === void 0 ? void 0 : _o.swipeList[0][0].start, (_p = _this.rod) === null || _p === void 0 ? void 0 : _p.gap);
                                    }
                                    if (e.deltaX > 0 && x > ((_q = _this.rod) === null || _q === void 0 ? void 0 : _q.swipeList[1][lenX - 1].start)) {
                                        (_r = _this.rod) === null || _r === void 0 ? void 0 : _r.paintX((_s = _this.rod) === null || _s === void 0 ? void 0 : _s.swipeList[1][lenX - 1].start, (_t = _this.rod) === null || _t === void 0 ? void 0 : _t.gap);
                                    }
                                }
                                // 竖向滚动
                                if (y > 0) {
                                    if (e.deltaY >= 0 && y > ((_u = _this.rod) === null || _u === void 0 ? void 0 : _u.verticalSwipes[1][lenY - 1].start)) {
                                        (_v = _this.rod) === null || _v === void 0 ? void 0 : _v.paintY((_w = _this.rod) === null || _w === void 0 ? void 0 : _w.verticalSwipes[1][lenY - 1].start, (_x = _this.rod) === null || _x === void 0 ? void 0 : _x.gap);
                                    }
                                    if (e.deltaY < 0 && y < ((_y = _this.rod) === null || _y === void 0 ? void 0 : _y.verticalSwipes[0][lenY - 1].start)) {
                                        (_z = _this.rod) === null || _z === void 0 ? void 0 : _z.paintY((_0 = _this.rod) === null || _0 === void 0 ? void 0 : _0.verticalSwipes[0][lenY - 1].start, (_1 = _this.rod) === null || _1 === void 0 ? void 0 : _1.gap);
                                    }
                                }
                                else {
                                    if (e.deltaY <= 0 && Math.abs(y) > Math.abs((_2 = _this.rod) === null || _2 === void 0 ? void 0 : _2.verticalSwipes[0][0].start)) {
                                        (_3 = _this.rod) === null || _3 === void 0 ? void 0 : _3.paintY((_4 = _this.rod) === null || _4 === void 0 ? void 0 : _4.verticalSwipes[0][0].start, (_5 = _this.rod) === null || _5 === void 0 ? void 0 : _5.gap);
                                    }
                                    if (e.deltaY > 0 && y > ((_6 = _this.rod) === null || _6 === void 0 ? void 0 : _6.verticalSwipes[1][lenY - 1].start)) {
                                        (_7 = _this.rod) === null || _7 === void 0 ? void 0 : _7.paintY((_8 = _this.rod) === null || _8 === void 0 ? void 0 : _8.verticalSwipes[1][lenY - 1].start, (_9 = _this.rod) === null || _9 === void 0 ? void 0 : _9.gap);
                                    }
                                }
                                _this.temStartY = (_10 = _this.rod) === null || _10 === void 0 ? void 0 : _10.verticalSwipes[1][0].start;
                                _this.temStartX = (_11 = _this.rod) === null || _11 === void 0 ? void 0 : _11.swipeList[1][0].start;
                            }
                            else { // 缩放  TODO
                                var gap = scaleX < 1 ? Math.ceil((width / _this.rod.countX)) : Math.ceil((width / _this.rod.countX) * scaleX);
                                _this.rod.gap = gap;
                                (_13 = (_12 = _this.rod) === null || _12 === void 0 ? void 0 : _12.paintX) === null || _13 === void 0 ? void 0 : _13.call(_12, _this.temStartX, gap);
                                (_15 = (_14 = _this.rod) === null || _14 === void 0 ? void 0 : _14.paintY) === null || _15 === void 0 ? void 0 : _15.call(_14, _this.temStartY, gap);
                                if (lastScrollTime !== null && (currentTime - lastScrollTime) < scrollThreshold) {
                                    // console.log("鼠标滚动");
                                }
                                else {
                                    // console.log("鼠标结束");
                                    // this.gap = gap;
                                    _this.temStartY = _this.rod.verticalSwipes[1][0].start;
                                    _this.temStartX = _this.rod.swipeList[1][0].start;
                                }
                                lastScrollTime = currentTime;
                            }
                        }
                    }
                    wheelListener(e);
                }, { passive: false });
                _this.root.addEventListener("pointermove", function (e) {
                    pointerListener(e);
                }, {
                    passive: true,
                });
            }
        };
        this.clearCanvas = function () {
            var _a, _b;
            (((_b = (_a = _this.app) === null || _a === void 0 ? void 0 : _a.stage) === null || _b === void 0 ? void 0 : _b.children) || []).forEach(function (i) {
                var _a, _b;
                (_b = (_a = _this.app) === null || _a === void 0 ? void 0 : _a.stage) === null || _b === void 0 ? void 0 : _b.removeChild(i);
            });
        };
    }
    Canvas.prototype.deleteGraffiti = function () {
        if (this.GraffitiList.length) {
            var deleteP_1 = this.GraffitiList[this.GraffitiList.length - 1];
            if (deleteP_1.children.length) {
                var deleteItem_1 = deleteP_1.children[deleteP_1.children.length - 1];
                if (deleteItem_1) {
                    deleteP_1.children = deleteP_1.children.filter(function (i) { return i !== deleteItem_1; });
                    deleteP_1.brush.removeChild(deleteItem_1.brush);
                    var findP = this.cacheGraffitiList.find(function (i) { return i.uuid === deleteP_1.uuid; });
                    if (findP) {
                        Object.assign(findP, {
                            children: __spreadArray(__spreadArray([], findP.children, true), [deleteItem_1], false),
                        });
                    }
                    else {
                        this.cacheGraffitiList.push(__assign(__assign({}, deleteP_1), { children: [deleteItem_1] }));
                    }
                }
            }
        }
    };
    Canvas.prototype.revokeGraffiti = function () {
        if (this.cacheGraffitiList.length) {
            var current = this.cacheGraffitiList[this.cacheGraffitiList.length - 1];
            if (current.children.length) {
                current.brush.addChild(current.children[current.children.length - 1].brush);
            }
        }
    };
    Canvas.prototype.getSelectedGraphics = function () {
        return this.selected;
    };
    Canvas.prototype.add = function (ele) {
        if (ele instanceof graffiti_1.default) {
            this.getBrushParent();
            var gra = new graffiti_1.default();
            gra.operate = operate;
            gra.app = this;
            this.GraffitiContainer.addChild(gra.brush);
            this.GraffitiList.push(gra);
            gra.brush.interactive = true;
            gra.container = this.GraffitiContainer;
        }
        else {
            ele.operate = operate;
            ele.container = this.mainContainer;
            ele.rootContainer = this.mainContainer;
            ele.rootDom = this.root;
            ele.app = this;
            ele.paint();
        }
    };
    Canvas.prototype.startGraffiti = function () {
        this.isGraffiti = true;
        operate.clear();
        operate.isDrag = false;
        this.cacheGraffitiList = [];
    };
    Canvas.prototype.endGraffiti = function () {
        this.isGraffiti = false;
        this.getBrushParent();
        this.cacheGraffitiList = [];
    };
    Canvas.prototype.getBrushParent = function () {
        if (this.GraffitiList.length) {
            var b = this.GraffitiList[this.GraffitiList.length - 1].brush; // 绘制当前涂鸦的父级
            var obj = (0, utils_1.getBoundRect)(b);
            b.beginFill(0xffffff, 0);
            b.drawRect(obj.x, obj.y, obj.width, obj.height);
            b.endFill();
        }
    };
    Canvas.prototype.getImage = function (ele) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.endGraffiti();
                        return [4 /*yield*/, (0, utils_1.exportImage)(ele, this.GraffitiList, this.mainContainer, this.GraffitiContainer)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Canvas.prototype.setScale = function (show) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.showScale = show;
        if (show) {
            (_a = this.app) === null || _a === void 0 ? void 0 : _a.stage.addChild((_b = this.rod) === null || _b === void 0 ? void 0 : _b.topContainer);
            (_c = this.app) === null || _c === void 0 ? void 0 : _c.stage.addChild((_d = this.rod) === null || _d === void 0 ? void 0 : _d.leftContainer);
            (_e = this.app) === null || _e === void 0 ? void 0 : _e.ticker.add(function () {
                var _a, _b;
                var _c = store_1.default.screen, x = _c.x, y = _c.y;
                var _d = store_1.default.scale, scaleX = _d.x, scaleY = _d.y;
                (_a = _this.rod) === null || _a === void 0 ? void 0 : _a.topContainer.position.set(-scaleX * x, 0);
                (_b = _this.rod) === null || _b === void 0 ? void 0 : _b.leftContainer.position.set(0, -scaleY * y);
            });
        }
        else {
            (_f = this.app) === null || _f === void 0 ? void 0 : _f.stage.removeChild((_g = this.rod) === null || _g === void 0 ? void 0 : _g.topContainer);
            (_h = this.app) === null || _h === void 0 ? void 0 : _h.stage.removeChild((_j = this.rod) === null || _j === void 0 ? void 0 : _j.leftContainer);
        }
    };
    Canvas.prototype.changeBgColor = function (color) {
        if (this.app) {
            this.app.renderer.backgroundColor = color;
        }
    };
    Canvas.prototype.attach = function (root) {
        var _this = this;
        this.root = root;
        store_1.default.initialize(root.clientWidth, root.clientHeight);
        var app = new pixi_js_1.Application({
            width: root.clientWidth,
            height: root.clientHeight,
            backgroundColor: 0xf3f3f3,
            resolution: 2,
            antialias: true,
            autoDensity: true,
            resizeTo: root,
        });
        this.app = app;
        root.appendChild(app.view);
        var top = new scale_1.default({ width: root.clientWidth });
        this.rod = top;
        this.mainContainer.addChild(operate.operateContainer);
        this.mainContainer.setChildIndex(operate.operateContainer, this.mainContainer.children.length - 1);
        this.appOperate();
        this.rootOperate();
        app.stage.addChild(this.mainContainer);
        app.stage.addChild(this.GraffitiContainer);
        // 监听帧更新
        app.ticker.add(function () {
            var _a = store_1.default.screen, x = _a.x, y = _a.y;
            var _b = store_1.default.scale, scaleX = _b.x, scaleY = _b.y;
            _this.mainContainer.position.set(-scaleX * x, -scaleY * y);
            _this.mainContainer.scale.set(scaleX, scaleY);
            _this.GraffitiContainer.position.set(-scaleX * x, -scaleY * y);
            _this.GraffitiContainer.scale.set(scaleX, scaleY);
        });
        this.temStartY = top.verticalSwipes[1][0].start;
        this.temStartX = top.swipeList[1][0].start;
    };
    Canvas.prototype.detach = function (root) {
        root.removeEventListener("mousewheel", wheelListener);
        root.removeEventListener("pointermove", pointerListener);
    };
    return Canvas;
}());
exports.default = Canvas;
