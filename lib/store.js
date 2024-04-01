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
exports.cameraToScreenCoordinates = exports.RECT_H = exports.RECT_W = exports.CAMERA_ANGLE = exports.getInitialCanvasState = void 0;
var getInitialCanvasState = function () {
    return {
        pixelRatio: window.devicePixelRatio || 1,
        container: {
            width: 0,
            height: 0,
        },
        camera: {
            x: 0,
            y: 0,
            z: 0,
        },
        pointer: {
            x: 0,
            y: 0,
        }
    };
};
exports.getInitialCanvasState = getInitialCanvasState;
var radians = function (angle) {
    return angle * (Math.PI / 180);
};
var canvasData = null;
exports.CAMERA_ANGLE = radians(30);
exports.RECT_W = 500;
exports.RECT_H = 500;
var cameraToScreenCoordinates = function (x, y, z, cameraAngle, screenAspect) {
    var width = 2 * z * Math.tan(exports.CAMERA_ANGLE);
    var height = width / screenAspect;
    var screenX = x - width / 2;
    var screenY = y - height / 2;
    return { x: screenX, y: screenY, width: width, height: height };
};
exports.cameraToScreenCoordinates = cameraToScreenCoordinates;
var scaleWithAnchorPoint = function (anchorPointX, anchorPointY, cameraX1, cameraY1, scaleX1, scaleY1, scaleX2, scaleY2) {
    var cameraX2 = (anchorPointX * (scaleX2 - scaleX1) + scaleX1 * cameraX1) / scaleX2;
    var cameraY2 = (anchorPointY * (scaleY2 - scaleY1) + scaleY1 * cameraY1) / scaleY2;
    return { x: cameraX2, y: cameraY2 };
};
var CanvasStore = /** @class */ (function () {
    function CanvasStore() {
    }
    Object.defineProperty(CanvasStore, "data", {
        get: function () {
            if (!canvasData)
                canvasData = {
                    pixelRatio: window.devicePixelRatio || 1,
                    pixelsPerFrame: 1,
                    container: {
                        width: 0,
                        height: 0,
                    },
                    pointer: {
                        x: 0,
                        y: 0,
                    },
                    canvas: {
                        width: 0,
                        height: 0,
                    },
                    camera: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                };
            return canvasData;
        },
        enumerable: false,
        configurable: true
    });
    CanvasStore.initialize = function (width, height) {
        var containerWidth = width;
        var containerHeight = height;
        canvasData = (0, exports.getInitialCanvasState)();
        canvasData.pixelRatio = window.devicePixelRatio || 1;
        canvasData.container.width = containerWidth;
        canvasData.container.height = containerHeight;
        canvasData.camera.y = height / 2;
        canvasData.camera.x = width / 2;
        canvasData.camera.z = containerWidth / (2 * Math.tan(exports.CAMERA_ANGLE));
    };
    Object.defineProperty(CanvasStore, "container", {
        get: function () {
            return this.data.container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasStore, "aspect", {
        get: function () {
            var _a = this.container, width = _a.width, height = _a.height;
            return width / height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasStore, "screen", {
        get: function () {
            var _a = this.camera, x = _a.x, y = _a.y, z = _a.z;
            var _b = CanvasStore.container, width = _b.width, height = _b.height;
            var aspect = width / height;
            var angle = radians(30);
            return (0, exports.cameraToScreenCoordinates)(x, y, z, angle, aspect);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasStore, "camera", {
        get: function () {
            return this.data.camera;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasStore, "pointer", {
        get: function () {
            return this.data.pointer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasStore, "scale", {
        get: function () {
            var _a = CanvasStore.screen, w = _a.width, h = _a.height;
            var _b = CanvasStore.container, cw = _b.width, ch = _b.height;
            return { x: cw / w, y: ch / h };
        },
        enumerable: false,
        configurable: true
    });
    CanvasStore.moveCamera = function (mx, my) {
        var scrollFactor = 1.5;
        var deltaX = mx * scrollFactor;
        var deltaY = my * scrollFactor;
        var _a = this.camera, x = _a.x, y = _a.y, z = _a.z;
        this.data.camera.x += deltaX;
        this.data.camera.y += deltaY;
        // move pointer by the same amount
        this.movePointer(deltaY, deltaY);
    };
    CanvasStore.movePointer = function (deltaX, deltaY) {
        var scale = this.scale;
        var _a = this.screen, left = _a.x, top = _a.y;
        this.data.pointer.x = left + deltaX / scale.x;
        this.data.pointer.y = top + deltaY / scale.y;
    };
    CanvasStore.zoomCamera = function (deltaX, deltaY) {
        var zoomScaleFactor = 10;
        var deltaAmount = zoomScaleFactor * Math.max(deltaY);
        var _a = this.camera, oldX = _a.x, oldY = _a.y, oldZ = _a.z;
        var oldScale = __assign({}, this.scale);
        var z = deltaY < 0 ? Math.abs(oldZ + deltaAmount) : oldZ + deltaAmount;
        var _b = this.container, containerWidth = _b.width, containerHeight = _b.height;
        var _c = (0, exports.cameraToScreenCoordinates)(oldX, oldY, z, 
        // oldZ + deltaAmount,
        exports.CAMERA_ANGLE, this.aspect), width = _c.width, height = _c.height;
        var newScaleX = containerWidth / width;
        var newScaleY = containerHeight / height;
        var _d = scaleWithAnchorPoint(this.pointer.x, this.pointer.y, oldX, oldY, oldScale.x, oldScale.y, newScaleX, newScaleY), newX = _d.x, newY = _d.y;
        // const newZ = oldZ + deltaAmount;
        var newZ = z;
        this.data.camera = {
            x: newX,
            y: newY,
            z: newZ,
        };
    };
    return CanvasStore;
}());
exports.default = CanvasStore;
