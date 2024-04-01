"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var utils_1 = require("./utils");
var utils_2 = require("./utils");
var store_1 = require("./store");
var EditGraphics = /** @class */ (function () {
    function EditGraphics(_a) {
        var _b = _a.width, width = _b === void 0 ? 0 : _b, _c = _a.height, height = _c === void 0 ? 0 : _c, position = _a.position, container = _a.container, _d = _a.shape, shape = _d === void 0 ? 'rect' : _d, _e = _a.radius, radius = _e === void 0 ? 0 : _e, _f = _a.lineStyle, lineStyle = _f === void 0 ? {
            width: 0,
        } : _f, _g = _a.background, background = _g === void 0 ? 0xff0000 : _g, rootContainer = _a.rootContainer, operate = _a.operate, _h = _a.name, name = _h === void 0 ? '' : _h, _j = _a.isEdit, isEdit = _j === void 0 ? true : _j, _k = _a.alpha, alpha = _k === void 0 ? 1 : _k;
        var _this = this;
        this.parent = {};
        this.alpha = 1;
        this.parentData = function () {
            _this.parent = (0, utils_1.getBoundRect)(_this.container);
        };
        this.delete = function () {
            var _a, _b;
            _this.container.removeChild(_this.graphics);
            (_b = (_a = _this.operate) === null || _a === void 0 ? void 0 : _a.clear) === null || _b === void 0 ? void 0 : _b.call(_a);
        };
        this.changePosition = function (_a) {
            var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            _this.position = { x: x, y: y };
            if (width)
                _this.width = width;
            if (height)
                _this.height = height;
        };
        this.repeat = function () {
            _this.graphics.beginFill(_this.background, _this.alpha);
            _this.graphics.lineStyle(_this.lineStyle.width, _this.lineStyle.color, _this.lineStyle.alpha, _this.lineStyle.alignment, _this.lineStyle.native);
            if (_this.shape === 'circle') {
                _this.graphics.drawCircle(_this.position.x, _this.position.y, _this.radius);
            }
            if (_this.shape === 'rect') {
                _this.graphics.drawRect(_this.position.x, _this.position.y, _this.width, _this.height);
            }
            if (_this.shape === 'roundedRect') {
                _this.graphics.drawRoundedRect(_this.position.x, _this.position.y, _this.width, _this.height, _this.radius);
            }
            _this.graphics.endFill();
        };
        this.down = function (e) {
            e.stopPropagation();
            if (!_this.app.isGraffiti) {
                _this.graphics.isDrag = true;
                _this.graphics.isMove = true;
                _this.move((0, utils_1.getPoint)(e));
            }
        };
        this.up = function (e) {
            e.stopPropagation();
            if (_this.graphics.isDrag) {
                _this.graphics.isDrag = false;
                var _a = (0, utils_1.getBoundRect)(_this.graphics), x = _a.x, y = _a.y;
                _this.position = { x: x, y: y };
                _this.graphics.clear();
                _this.repeat();
                _this.graphics.position.set(0, 0);
            }
        };
        this.width = width;
        this.height = height;
        this.position = position;
        this.rootContainer = rootContainer;
        this.container = container;
        this.shape = shape;
        this.radius = radius;
        this.lineStyle = lineStyle;
        this.background = background;
        this.operate = operate;
        this.name = name;
        this.uuid = "".concat((0, utils_2.uuid)());
        this.isEdit = isEdit;
        this.alpha = alpha;
        this.paint();
        this.parentData();
    }
    EditGraphics.prototype.paint = function () {
        this.graphics = new pixi_js_1.Graphics();
        this.graphics.name = this.name;
        this.graphics.uuid = this.uuid;
        this.graphics.repeat = this.repeat;
        this.graphics.changePosition = this.changePosition;
        this.graphics.delete = this.delete;
        this.graphics.parentData = this.parentData;
        this.graphics.radius = this.radius;
        this.graphics.shape = this.shape;
        this.graphics.isDrag = false;
        this.repeat();
        this.graphics.on('pointerdown', this.down);
        this.graphics.on('pointerup', this.up);
        this.graphics.antialias = true; // 抗锯齿
        this.graphics.autoDensity = true; // 模糊处理
        this.graphics.interactive = this.isEdit;
        if (this.container) {
            this.container.addChild(this.graphics);
        }
    };
    EditGraphics.prototype.move = function (start) {
        var _this = this;
        this.graphics.on('pointermove', function (e) {
            if (_this.graphics.isDrag) {
                var scalePosition = (0, utils_1.getPoint)(e);
                // Graphics 容器里面的位置并不是实际的position x, y 是父级原点 0, 0;
                var x = scalePosition.x - start.x;
                var y = scalePosition.y - start.y;
                _this.graphics.position.set(x / store_1.default.scale.x, y / store_1.default.scale.x);
                _this.operate.clear();
            }
        });
    };
    return EditGraphics;
}());
;
exports.default = EditGraphics;
