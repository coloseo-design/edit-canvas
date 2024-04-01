"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var utils_1 = require("./utils");
var store_1 = require("./store");
var EditImage = /** @class */ (function () {
    function EditImage(_a) {
        var _b = _a.url, url = _b === void 0 ? '' : _b, _c = _a.position, position = _c === void 0 ? {} : _c, container = _a.container, width = _a.width, height = _a.height, operate = _a.operate, text = _a.text;
        var _this = this;
        this.url = '';
        this.width = 0;
        this.height = 0;
        this.delete = function () {
            var _a, _b, _c;
            (_a = _this.operate) === null || _a === void 0 ? void 0 : _a.clear();
            (_c = (_b = _this.container) === null || _b === void 0 ? void 0 : _b.removeChild) === null || _c === void 0 ? void 0 : _c.call(_b, _this.sprite);
        };
        this.paint = function () {
            new pixi_js_1.Loader().add('myImage', _this.url).load(function (loader, resources) {
                var _a;
                if (resources) {
                    var myTexture = (_a = resources['myImage']) === null || _a === void 0 ? void 0 : _a.texture;
                    _this.sprite = new pixi_js_1.Sprite(myTexture);
                    _this.sprite.position.set(_this.position.x, _this.position.y); //设置位置
                    _this.sprite.width = _this.width;
                    _this.sprite.height = _this.height;
                    _this.sprite.interactive = true;
                    _this.sprite.changePosition = _this.changePosition;
                    _this.sprite.delete = _this.delete;
                    // 配置文字遮罩层
                    if (_this.text) {
                        _this.sprite.mask = _this.text;
                    }
                    _this.sprite.on('pointerdown', _this.down);
                    _this.sprite.isDrag = false;
                    _this.sprite.on('pointerup', _this.up);
                    if (_this.container) {
                        _this.container.addChild(_this.sprite);
                    }
                }
            });
        };
        this.change = function (_a) {
            var x = _a.x, y = _a.y, w = _a.w, h = _a.h;
            _this.sprite.position.set(x, y);
            _this.position = { x: x, y: y };
            _this.sprite.width = w;
            _this.sprite.height = h;
        };
        this.changePosition = function (_a) {
            var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            _this.position = { x: x, y: y };
            if (width) {
                _this.sprite.width = width;
                _this.width = width;
            }
            if (height) {
                _this.sprite.height = height;
                _this.height = height;
            }
        };
        this.down = function (e) {
            if (!_this.app.isGraffiti) {
                _this.sprite.isDrag = true;
                _this.move((0, utils_1.getPoint)(e));
            }
        };
        this.up = function () {
            if (_this.sprite.isDrag) {
                _this.sprite.isDrag = false;
                _this.position = {
                    x: _this.sprite.x,
                    y: _this.sprite.y,
                };
            }
        };
        this.url = url;
        this.position = position;
        this.container = container;
        this.width = width;
        this.height = height;
        this.operate = operate;
        this.text = text;
    }
    EditImage.prototype.move = function (start) {
        var _this = this;
        this.sprite.on('pointermove', function (e) {
            if (_this.sprite.isDrag) {
                var scalePosition = (0, utils_1.getPoint)(e);
                var x = (scalePosition.x - start.x) / store_1.default.scale.x + _this.position.x;
                var y = (scalePosition.y - start.y) / store_1.default.scale.x + _this.position.y;
                _this.sprite.position.set(x, y);
                _this.operate.clear();
            }
        });
    };
    return EditImage;
}());
exports.default = EditImage;
