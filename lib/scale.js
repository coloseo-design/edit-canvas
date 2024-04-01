"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var store_1 = require("./store");
var utils_1 = require("./utils");
var ScaleLine = /** @class */ (function () {
    function ScaleLine(_a) {
        var _b = _a.gap, gap = _b === void 0 ? 100 : _b;
        this.boundary = 135000;
        this.countX = 1;
        this.countY = 1;
        this.swipeList = [];
        this.verticalSwipes = [];
        this.gap = gap;
        this.topContainer = this.paintContainer(-this.boundary, 0, this.boundary * 2, 30);
        this.leftContainer = this.paintContainer(0, -this.boundary, 30, this.boundary * 2);
        this.countX = Math.ceil(store_1.default.screen.width / gap);
        this.countY = Math.ceil(store_1.default.screen.height / gap);
        this.swipeList = [];
        this.scrollList = new pixi_js_1.Graphics();
        this.verticalScroll = new pixi_js_1.Graphics();
        this.paintX();
        this.paintY();
    }
    ScaleLine.prototype.paintContainer = function (x, y, width, height) {
        var container = new pixi_js_1.Graphics();
        container.beginFill(0xffffff);
        container.lineStyle(1, 0xA6A8A9);
        container.drawRect(x, y, width, height);
        container.endFill();
        return container;
    };
    ScaleLine.prototype.paint = function (start, isVertical, gap) {
        var _this = this;
        if (isVertical === void 0) { isVertical = false; }
        if (gap === void 0) { gap = 100; }
        var mid = [];
        var prefix = [];
        var suffix = [];
        var temList = [];
        var count = isVertical ? this.countY : this.countX;
        var suffixStart = (count - 1) * gap + start;
        Array.from({ length: count }).forEach(function (_, key) {
            var uid = "".concat((0, utils_1.uuid)());
            var dm = key * gap + start; // 当前位置
            var ds = suffixStart + (key + 1) * gap; // 后一屏位置
            var dp = start - (count - key) * gap; // 前一屏位置
            _this.write(dm, temList, uid, mid, isVertical);
            _this.write(ds, temList, uid, suffix, isVertical);
            _this.write(dp, temList, uid, prefix, isVertical);
        });
        if (isVertical) {
            this.verticalSwipes = [prefix, mid, suffix];
            this.verticalScroll.children = temList;
            this.leftContainer.addChild(this.verticalScroll);
        }
        else {
            this.swipeList = [prefix, mid, suffix];
            this.scrollList.children = temList;
            this.topContainer.addChild(this.scrollList);
        }
    };
    ScaleLine.prototype.paintX = function (start, gap) {
        if (start === void 0) { start = 0; }
        if (gap === void 0) { gap = 100; }
        this.paint(start, false, gap);
    };
    ScaleLine.prototype.paintY = function (start, gap) {
        if (start === void 0) { start = 0; }
        if (gap === void 0) { gap = 100; }
        this.paint(start, true, gap);
    };
    ScaleLine.prototype.write = function (distance, temList, uid, list, isVertical) {
        if (temList === void 0) { temList = []; }
        if (list === void 0) { list = []; }
        if (isVertical === void 0) { isVertical = false; }
        var x = store_1.default.scale.x;
        var d = Math.ceil(distance * x);
        var tx = isVertical ? 20 : d;
        var ty = isVertical ? d : 10;
        var txt = this.text("".concat(distance), tx, ty, isVertical);
        txt.uuid = uid;
        var linM = {
            x: isVertical ? 25 : d,
            y: isVertical ? d : 25,
        };
        var lineT = {
            x: isVertical ? 30 : d,
            y: isVertical ? d : 30,
        };
        var line = this.line(linM, lineT);
        line.uuid = uid;
        if (isVertical) {
            this.verticalScroll.addChild(line);
            this.verticalScroll.addChild(txt);
        }
        else {
            this.scrollList.addChild(line);
            this.scrollList.addChild(txt);
        }
        list.push({ start: distance, uid: uid });
        temList.push.apply(temList, [txt, line]);
    };
    ScaleLine.prototype.line = function (move, end) {
        var line = new pixi_js_1.Graphics();
        line.lineStyle(1, 0xA6A8A9, 1);
        line.clear();
        line.lineStyle(1, 0xA6A8A9, 1);
        line.moveTo(move.x, move.y);
        line.lineTo(end.x, end.y);
        return line;
    };
    ScaleLine.prototype.text = function (txt, x, y, isVertical) {
        var text = new pixi_js_1.Text(txt, {
            fill: 0xA6A8A9,
            fontSize: 10,
        });
        var tx = isVertical ? x : x - text.width / 2;
        var ty = isVertical ? y - text.width / 2 : y;
        if (isVertical) {
            text.rotation = Math.PI / 2;
        }
        text.position.set(tx, ty);
        return text;
    };
    return ScaleLine;
}());
;
exports.default = ScaleLine;
