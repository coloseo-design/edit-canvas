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
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var utils_1 = require("./utils");
var store_1 = require("./store");
var EditText = /** @class */ (function () {
    function EditText(_a) {
        var _b = _a.width, width = _b === void 0 ? 0 : _b, _c = _a.height, height = _c === void 0 ? 0 : _c, _d = _a.value, value = _d === void 0 ? '' : _d, _e = _a.style, style = _e === void 0 ? {} : _e, _f = _a.position, position = _f === void 0 ? {} : _f, container = _a.container, rootContainer = _a.rootContainer, operate = _a.operate;
        var _this = this;
        this.value = '';
        this.style = {};
        this.width = 0;
        this.height = 0;
        this.uuid = "".concat((0, utils_1.uuid)());
        this.parent = {};
        this.input = null;
        this.rootDom = null;
        this.isPinyin = false;
        this.isFocus = false;
        this.paint = function () {
            var textStyle = new pixi_js_1.TextStyle(__assign({}, _this.style));
            _this.text = new pixi_js_1.Text(_this.value, textStyle);
            _this.text.interactive = true;
            _this.text.buttonMode = true;
            _this.text.resolution = 2;
            _this.text.position.set(_this.position.x, _this.position.y);
            _this.text.on('pointerdown', _this.down);
            _this.text.on('pointerup', _this.up);
            _this.text.uuid = _this.uuid;
            _this.text.isDrag = false;
            _this.text.changePosition = _this.changePosition;
            _this.text.parentData = _this.parentData;
            _this.text.delete = _this.delete;
            if (_this.width) {
                _this.text.width = _this.width;
            }
            else {
                _this.width = _this.text.width;
            }
            if (_this.height) {
                _this.text.height = _this.height;
            }
            else {
                _this.height = _this.text.height;
            }
            if (_this.container) {
                _this.container.addChild(_this.text);
            }
            _this.createInput();
            _this.parentData();
        };
        this.oninput = function (e) {
            var _a, _b;
            if (!_this.isPinyin) {
                _this.value = (_a = e.target) === null || _a === void 0 ? void 0 : _a.value;
                _this.text.text = (_b = e.target) === null || _b === void 0 ? void 0 : _b.value;
            }
        };
        this.writeText = function (value) {
            _this.isFocus = true;
            if (value) {
                _this.value = value;
                _this.text.text = value;
            }
            _this.createInput();
        };
        this.onfocus = function () {
            _this.isFocus = true;
            if (_this.input) {
                _this.input.style.zIndex = '100';
            }
        };
        this.onblur = function () {
            _this.isFocus = false;
            if (_this.input) {
                _this.input.style.zIndex = '-100';
            }
        };
        this.oncompositionstart = function () {
            _this.isPinyin = true;
        };
        this.oncompositionend = function (e) {
            _this.isPinyin = false;
            _this.oninput(e);
        };
        this.parentData = function () {
            _this.parent = (0, utils_1.getBoundRect)(_this.container);
        };
        this.changePosition = function (_a) {
            var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            _this.position = { x: x, y: y };
            if (width)
                _this.width = width;
            if (height)
                _this.height = height;
        };
        this.delete = function () {
            var _a, _b;
            (_a = _this.container) === null || _a === void 0 ? void 0 : _a.removeChild(_this.text);
            (_b = _this.operate) === null || _b === void 0 ? void 0 : _b.clear();
        };
        this.down = function (e) {
            e.stopPropagation();
            if (!_this.app.isGraffiti) {
                _this.text.isDrag = true;
                if (!_this.isFocus) {
                    _this.move((0, utils_1.getPoint)(e));
                }
            }
        };
        this.up = function (e) {
            e.stopPropagation();
            if (_this.text.isDrag) {
                _this.text.isDrag = false;
                _this.position = {
                    x: (0, utils_1.getBoundRect)(_this.text).x,
                    y: (0, utils_1.getBoundRect)(_this.text).y,
                };
            }
        };
        this.style = style;
        this.position = position;
        this.value = value;
        this.container = container;
        this.operate = operate;
        this.width = width;
        this.height = height;
        this.rootContainer = rootContainer;
    }
    EditText.prototype.createInput = function () {
        var _a;
        var input = document.createElement('input');
        input.setAttribute('style', "position: absolute;\n    height: ".concat(this.text.height, "px;\n    min-width: ").concat(this.width, "px;\n    left: ").concat((this.position.x || 0), "px;\n    top: ").concat((this.position.y || 0), "px;\n    border: none; outline: none;\n    z-index: ").concat(this.isFocus ? '100' : '-100', ";\n    font-size: ").concat(this.style.fontSize, "px;\n    caret-color: black;\n    color: transparent;\n    background: transparent;\n    "));
        this.input = input;
        this.input.value = this.value;
        this.input.addEventListener('input', this.oninput);
        this.input.addEventListener('focus', this.onfocus);
        this.input.addEventListener('blur', this.onblur);
        this.input.addEventListener('compositionstart', this.oncompositionstart);
        this.input.addEventListener('compositionend', this.oncompositionend);
        (_a = this.rootDom) === null || _a === void 0 ? void 0 : _a.appendChild(input);
    };
    EditText.prototype.move = function (start) {
        var _this = this;
        this.text.on('pointermove', function (e) {
            if (_this.text.isDrag) {
                var scalePosition = (0, utils_1.getPoint)(e);
                var x = (scalePosition.x - start.x) / store_1.default.scale.x + _this.position.x;
                var y = (scalePosition.y - start.y) / store_1.default.scale.x + _this.position.y;
                _this.text.position.set(x, y);
                _this.operate.clear();
            }
        });
    };
    return EditText;
}());
exports.default = EditText;
