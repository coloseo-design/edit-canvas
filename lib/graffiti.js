"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var utils_1 = require("./utils");
var utils_2 = require("./utils");
var store_1 = require("./store");
var Graffiti = /** @class */ (function () {
    function Graffiti(props) {
        var _this = this;
        this.children = [];
        this.paint = function (e) {
            var scalePosition = (0, utils_2.getPoint)(e);
            _this.brush.beginFill(_this.color, _this.alpha);
            _this.brush.isDrag = false;
            _this.brush.drawCircle(scalePosition.x, scalePosition.y, _this.lineWidth);
            _this.brush.endFill();
        };
        this.delete = function () {
            var _a, _b, _c;
            (_a = _this.container) === null || _a === void 0 ? void 0 : _a.removeChild(_this.brush);
            (_c = (_b = _this.operate) === null || _b === void 0 ? void 0 : _b.clear) === null || _c === void 0 ? void 0 : _c.call(_b);
        };
        this.repeat = function (rect) {
            _this.brush.beginFill(0xffffff, 0);
            _this.brush.drawRect(rect.x, rect.y, rect.width, rect.height);
            _this.brush.endFill();
        };
        this.down = function (e) {
            e.stopPropagation();
            if (!_this.app.isGraffiti) {
                _this.brush.isDrag = true;
                _this.move((0, utils_2.getPoint)(e));
            }
        };
        this.move = function (start) {
            _this.brush.on('pointermove', function (e) {
                if (_this.brush.isDrag) {
                    var scalePosition = (0, utils_2.getPoint)(e);
                    var x = (scalePosition.x - start.x) / store_1.default.scale.x;
                    var y = (scalePosition.y - start.y) / store_1.default.scale.x;
                    _this.brush.position.set(x, y);
                    _this.operate.clear();
                }
            });
        };
        this.up = function () {
            if (_this.brush.isDrag) {
                _this.brush.isDrag = false;
            }
        };
        var _a = props || {}, _b = _a.color, color = _b === void 0 ? 0x6078F4 : _b, _c = _a.lineWidth, lineWidth = _c === void 0 ? 10 : _c, _d = _a.alpha, alpha = _d === void 0 ? 0.7 : _d;
        var brush = new pixi_js_1.Graphics();
        this.brush = brush;
        this.color = color;
        this.brush.repeat = this.repeat;
        this.lineWidth = lineWidth;
        this.brush.delete = this.delete;
        this.brush.paint = this.paint;
        this.alpha = alpha;
        this.uuid = "".concat((0, utils_1.uuid)());
        this.brush.on('pointerdown', this.down);
        this.brush.on('pointerup', this.up);
    }
    Graffiti.prototype.setStyle = function (_a) {
        var color = _a.color, alpha = _a.alpha, lineWidth = _a.lineWidth;
        if (color) {
            this.color = color;
        }
        if (lineWidth) {
            this.lineWidth = lineWidth;
        }
        if (alpha) {
            this.alpha = alpha;
        }
    };
    return Graffiti;
}());
;
exports.default = Graffiti;
