"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var utils_1 = require("./utils");
var store_1 = require("./store");
var OperateRect = /** @class */ (function () {
    function OperateRect(_a) {
        var _b = _a.lineStyle, lineStyle = _b === void 0 ? { width: 1, color: 0x0000ff } : _b, _c = _a.position, position = _c === void 0 ? {} : _c;
        var _this = this;
        this.width = 0;
        this.height = 0;
        this.isDrag = false;
        this.startPosition = { x: 0, y: 0 };
        this.moveType = '';
        this.x = 0;
        this.y = 0;
        this.originX = 0;
        this.originY = 0;
        this.originW = 0;
        this.originH = 0;
        this.root = null;
        this.clear = function () {
            Object.values(_this.dirMap).forEach(function (item) {
                item.clear();
            });
        };
        this.paintRect = function (_a, init) {
            var x = _a.x, y = _a.y, w = _a.w, h = _a.h;
            if (init === void 0) { init = false; }
            Object.keys(_this.dirMap).forEach(function (item) {
                if (item === 'main') {
                    if (init) {
                        _this.dirMap[item].interactive = true;
                        // this.dirMap[item].on('pointerup', this.hornUp);
                        _this.dirMap[item].name = "".concat(item);
                        _this.dirMap[item].zIndex = -1;
                        _this.dirMap[item].endFill();
                    }
                    else {
                        _this.dirMap[item].beginFill(0xffffff, 0);
                        // this.dirMap[item].beginFill(0xffffff, 0.0001);
                        _this.dirMap[item].lineStyle(_this.lineStyle.width, _this.lineStyle.color, _this.lineStyle.alpha, _this.lineStyle.alignment, _this.lineStyle.native);
                        _this.dirMap[item].drawRect(x - 4, y - 4, w + 8, h + 8);
                    }
                }
                else {
                    if (init) {
                        _this.dirMap[item].interactive = true;
                        _this.dirMap[item].name = "".concat(item);
                        // this.dirMap[item].on('pointerdown', (e: InteractionEvent) => {
                        //   this.hornDown(item, e);
                        // });
                        // this.dirMap[item].on('pointerup', this.hornUp);
                        _this.dirMap[item].endFill();
                    }
                    else {
                        _this.dirMap[item].beginFill(0xffffff);
                        _this.dirMap[item].lineStyle(1, 0x0000ff);
                        var x1 = x - 8;
                        var x2 = x + w;
                        var y1 = y - 8;
                        var y2 = y + h;
                        _this.dirMap[item].drawRect(item.indexOf('left') > -1 ? x1 : x2, item.indexOf('Top') > -1 ? y1 : y2, 8, 8);
                    }
                }
            });
        };
        this.paint = function (_a, isSelf, init) {
            var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            if (isSelf === void 0) { isSelf = false; }
            if (init === void 0) { init = false; }
            if (!isSelf) {
                _this.originX = x - 4;
                _this.originY = y - 4;
                _this.originW = width + 8;
                _this.originH = height + 8;
            }
            _this.width = isSelf ? width : width + 8;
            _this.height = isSelf ? height : height + 8;
            _this.x = isSelf ? x : x - 4;
            _this.y = isSelf ? y : y - 4;
            _this.paintRect({ x: x, y: y, w: width, h: height }, init);
        };
        this.hornDown = function (type, e) {
            _this.isDrag = true;
            var startPosition = (0, utils_1.getPoint)(e);
            _this.startPosition = startPosition;
            _this.hornMove(type);
            if (_this.root) {
                _this.root.style.cursor = _this.getCursor(type);
            }
        };
        this.getCursor = function (type) {
            var cursor = 'default';
            switch (type) {
                case 'leftBottom':
                    cursor = 'nesw-resize';
                    break;
                case 'leftTop':
                    cursor = 'nwse-resize';
                    break;
                default:
                    cursor = 'default';
                    break;
            }
            return cursor;
        };
        this.hornMove = function (type) {
            _this.dirMap[type].on('pointermove', function (e) {
                if (_this.isDrag && type === _this.moveType) {
                    _this.diffMove(type, e);
                }
            });
        };
        this.diffMove = function (type, e) {
            var _a, _b, _c, _d, _e, _f;
            _this.clear();
            var scalePosition = (0, utils_1.getPoint)(e);
            var dx = (scalePosition.x - _this.startPosition.x) / store_1.default.scale.x;
            var dy = (scalePosition.y - _this.startPosition.y) / store_1.default.scale.x;
            var diffX = dx + _this.dirMap[type].x;
            var diffY = dy + _this.dirMap[type].y;
            var x = _this.originX, y = _this.originY, width = _this.originW, height = _this.originH;
            if (type === 'leftBottom') {
                x = x + diffX;
                width = width - diffX;
                height = height + diffY;
            }
            if (type === 'leftTop') {
                x = x + diffX;
                y = y + diffY;
                width = width - diffX;
                height = height - diffY;
            }
            if (type === 'rightTop') {
                y = y + diffY;
                width = width + diffX;
                height = height - diffY;
            }
            if (type === 'rightBottom') {
                width = width + diffX;
                height = height + diffY;
            }
            if (type === 'main') {
                x = diffX + x;
                y = diffY + y;
            }
            if (_this.operateGraphical) {
                if (_this.operateGraphical instanceof pixi_js_1.Graphics) {
                    _this.operateGraphical.isMove = false;
                    _this.operateGraphical.clear();
                    _this.operateGraphical.position.set(0, 0);
                    (_b = (_a = _this.operateGraphical) === null || _a === void 0 ? void 0 : _a.changePosition) === null || _b === void 0 ? void 0 : _b.call(_a, { x: x, y: y, width: width, height: height });
                    (_d = (_c = _this.operateGraphical) === null || _c === void 0 ? void 0 : _c.repeat) === null || _d === void 0 ? void 0 : _d.call(_c, { x: x, y: y, width: width, height: height });
                }
                else {
                    _this.operateGraphical.position.set(x, y);
                    (_f = (_e = _this.operateGraphical).changePosition) === null || _f === void 0 ? void 0 : _f.call(_e, { x: x, y: y, width: width, height: height });
                }
            }
            _this.paint({ x: x, y: y, width: width, height: height }, true);
        };
        this.hornUp = function () {
            if (_this.isDrag) {
                _this.isDrag = false;
                _this.operateGraphical = null;
                _this.moveType = '';
            }
        };
        this.lineStyle = lineStyle;
        this.position = position;
        this.operateContainer = new pixi_js_1.Graphics();
        this.operateContainer.name = 'operateContainer';
        this.main = new pixi_js_1.Graphics();
        this.leftBottom = new pixi_js_1.Graphics();
        this.leftTop = new pixi_js_1.Graphics();
        this.rightTop = new pixi_js_1.Graphics();
        this.rightBottom = new pixi_js_1.Graphics();
        this.dirMap = {
            'rightBottom': this.rightBottom,
            'leftBottom': this.leftBottom,
            'leftTop': this.leftTop,
            'rightTop': this.rightTop,
            'main': this.main,
        };
        this.operateContainer.addChild(this.main, this.leftBottom, this.leftTop, this.rightBottom, this.rightTop);
        this.paint({ x: 0, y: 0, width: 0, height: 0 }, true, true);
    }
    return OperateRect;
}());
exports.default = OperateRect;
