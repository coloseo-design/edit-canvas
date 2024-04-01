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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportImage = exports.loopChild = exports.overflowContainer = exports.getBoundRect = exports.uuid = exports.getPoint = void 0;
var pixi_js_1 = require("pixi.js");
var text_1 = require("./text");
var graphics_1 = require("./graphics");
var store_1 = require("./store");
var getPoint = function (e) {
    return {
        x: e.data.global.x,
        y: e.data.global.y,
    };
};
exports.getPoint = getPoint;
var uuid = function () {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return "".concat(S4()).concat(S4(), "-").concat(S4(), "-").concat(S4(), "-").concat(S4(), "-").concat(S4()).concat(S4()).concat(S4());
};
exports.uuid = uuid;
var getBoundRect = function (ele) {
    if (ele) {
        var _a = ele.getBounds(), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        var _b = store_1.default.screen, screenX_1 = _b.x, screenY_1 = _b.y;
        var _c = store_1.default.scale, scaleX = _c.x, scaleY = _c.y;
        var moveX = screenX_1 * scaleX;
        var moveY = screenY_1 * scaleY;
        var originX = (x + moveX) / scaleX;
        var originY = (y + moveY) / scaleY;
        var originW = width / scaleX;
        var originH = height / scaleY;
        return {
            x: originX,
            y: originY,
            width: Number(originW.toFixed(2)),
            height: Number(originH.toFixed(2)),
        };
    }
    return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
};
exports.getBoundRect = getBoundRect;
var overflowContainer = function (ele, parent) {
    var _a = (0, exports.getBoundRect)(ele), x = _a.x, y = _a.y, w = _a.width, h = _a.height;
    var x1 = parent.x, y1 = parent.y, w1 = parent.width, h1 = parent.height;
    // 判断 ele 是否在parent 里面
    var ax = false;
    var ay = false;
    if ((x > 0 && x >= x1 && x + w <= x1 + w1) || (x < 0 && x <= x1 && Math.abs(x) + w <= Math.abs(x1) + w1)) {
        ax = true;
    }
    if ((y > 0 && y >= y1 && y + h <= y1 + h1) || (y < 0 && y <= y1 && Math.abs(y) + h <= Math.abs(y1) + h1)) {
        ay = true;
    }
    return (!ax || !ay) ? true : false;
};
exports.overflowContainer = overflowContainer;
var loopChild = function (data, editInfo) {
    if (data === void 0) { data = []; }
    if (editInfo === void 0) { editInfo = null; }
    data.forEach(function (item) {
        var _a, _b, _c, _d;
        var _e = (0, exports.getBoundRect)(item), x = _e.x, y = _e.y;
        var x2 = 0, y2 = 0;
        if (item instanceof pixi_js_1.Text) {
            var x1 = editInfo ? x + editInfo.x : x;
            var y1 = editInfo ? y + editInfo.y : y;
            ;
            (_b = (_a = item).changePosition) === null || _b === void 0 ? void 0 : _b.call(_a, { x: x1, y: y1 });
            item.position.set(x1, y1);
        }
        if (item instanceof pixi_js_1.Graphics) {
            x2 = item.x;
            y2 = item.y;
            var r = item.shape === 'circle' ? (item === null || item === void 0 ? void 0 : item.radius) || 0 : 0;
            (_d = (_c = item).changePosition) === null || _d === void 0 ? void 0 : _d.call(_c, { x: x + r, y: y + r });
            item.clear();
            item === null || item === void 0 ? void 0 : item.repeat((0, exports.getBoundRect)(item));
            item.position.set(0, 0);
        }
        item === null || item === void 0 ? void 0 : item.parentData();
        if (item.children && item.children.length) {
            (0, exports.loopChild)(item.children, item instanceof pixi_js_1.Graphics ? { x: x2, y: y2 } : null);
        }
    });
};
exports.loopChild = loopChild;
var sleep = function (num) {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(null); }, num);
    });
};
var exportImage = function (main, graffitiL, mainContainer, GraffitiContainer) { return __awaiter(void 0, void 0, void 0, function () {
    var rect, _a, width, height, x, y, graffitiSrc, cropSrc, common, imageApp, imageContainer, mainSrc, last, _b, bw, bh, bx, by, cApp, cContainer, mask, image, tx, ty, canvasElement, ctx;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                rect = main instanceof text_1.default ? main.text : main instanceof graphics_1.default ? main.graphics : main.sprite;
                _a = (0, exports.getBoundRect)(rect), width = _a.width, height = _a.height, x = _a.x, y = _a.y;
                graffitiSrc = '';
                cropSrc = '';
                common = {
                    resolution: 12,
                    antialias: true,
                    autoDensity: true,
                    transparent: true,
                };
                imageApp = new pixi_js_1.Application(__assign({ width: width, height: height }, common));
                imageContainer = new pixi_js_1.Container();
                imageContainer.addChild(rect);
                imageApp.stage.addChild(imageContainer);
                mainSrc = imageApp.renderer.plugins.extract.base64(imageContainer);
                mainContainer.addChild(rect);
                last = graffitiL[graffitiL.length - 1];
                if (!last) return [3 /*break*/, 2];
                _b = (0, exports.getBoundRect)(last.brush), bw = _b.width, bh = _b.height, bx = _b.x, by = _b.y;
                cApp = new pixi_js_1.Application({
                    width: bw,
                    height: bh,
                    resolution: 12,
                    antialias: true,
                    autoDensity: true,
                    transparent: true,
                });
                cContainer = new pixi_js_1.Container();
                mask = new pixi_js_1.Graphics();
                mask.beginFill(0x000000, 0);
                mask.drawRect(bx, by, bw, bh);
                mask.endFill();
                mask.addChild(last.brush);
                cApp.stage.addChild(cContainer);
                cContainer.addChild(mask);
                graffitiSrc = cApp.renderer.plugins.extract.base64(cContainer);
                image = cApp.renderer.plugins.extract.image(cContainer, "image/png", 1);
                GraffitiContainer.addChild(last.brush);
                return [4 /*yield*/, sleep(100)];
            case 1:
                _c.sent();
                tx = x - bx;
                ty = y - by;
                canvasElement = document.createElement('canvas');
                ctx = canvasElement.getContext('2d');
                canvasElement.width = width;
                canvasElement.height = height;
                ctx.drawImage(image, tx, ty, width, height, 0, 0, width, height);
                cropSrc = canvasElement.toDataURL("image/png");
                _c.label = 2;
            case 2: return [2 /*return*/, {
                    mainSrc: mainSrc,
                    graffitiSrc: graffitiSrc,
                    cropSrc: cropSrc,
                }];
        }
    });
}); };
exports.exportImage = exportImage;
