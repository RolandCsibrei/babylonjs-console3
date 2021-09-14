"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
exports.__esModule = true;
var BABYLON = require("babylonjs");
var BABYLON_GUI = require("babylonjs-gui");
var DefaultConsole3Options = {
    floatPrecision: 4,
    mainPanelWidth: 1,
    consolePanelWidth: 1,
    observerPanelWidthInPixels: 160,
    observerPanelColor: BABYLON.Color3.Gray(),
    debuggerHitPanelColor: BABYLON.Color3.Red(),
    highliteHitPanelColor: BABYLON.Color3.Yellow(),
    meshBadgeLinkXOffsetInPixels: 100,
    meshBadgeLinkYOffsetInPixels: 200,
    consolePanelAlpha: 0.4,
    mainPanelAlpha: 0.4,
    linesAlpha: 0.4,
    maxConsoleLineEntities: 10,
    consoleLineHeightInPixels: 12,
    consolePanelHeightInPixels: 10 * 12
};
var Console3LoggedEntityType;
(function (Console3LoggedEntityType) {
    Console3LoggedEntityType[Console3LoggedEntityType["Text"] = 0] = "Text";
    Console3LoggedEntityType[Console3LoggedEntityType["Float"] = 1] = "Float";
    Console3LoggedEntityType[Console3LoggedEntityType["Boolean"] = 2] = "Boolean";
    Console3LoggedEntityType[Console3LoggedEntityType["Mesh"] = 3] = "Mesh";
    Console3LoggedEntityType[Console3LoggedEntityType["Vector2"] = 4] = "Vector2";
    Console3LoggedEntityType[Console3LoggedEntityType["Vector3"] = 5] = "Vector3";
    Console3LoggedEntityType[Console3LoggedEntityType["Color3"] = 6] = "Color3";
    Console3LoggedEntityType[Console3LoggedEntityType["Color4"] = 7] = "Color4";
    Console3LoggedEntityType[Console3LoggedEntityType["Vector3Array"] = 8] = "Vector3Array";
})(Console3LoggedEntityType || (Console3LoggedEntityType = {}));
var Side;
(function (Side) {
    Side[Side["Left"] = 0] = "Left";
    Side[Side["Right"] = 1] = "Right";
})(Side || (Side = {}));
var SharedMaterials;
(function (SharedMaterials) {
    SharedMaterials[SharedMaterials["Vector3ArrayLine"] = 0] = "Vector3ArrayLine";
    SharedMaterials[SharedMaterials["Vector3ArrayMarker"] = 1] = "Vector3ArrayMarker";
})(SharedMaterials || (SharedMaterials = {}));
var Console3LoggedEntity = /** @class */ (function () {
    function Console3LoggedEntity(name, type, source, property, options) {
        this.name = name;
        this.type = type;
        this.source = source;
        this.property = property;
        this.options = options;
        this.textInputs = [];
        this.refreshRate = 1;
        this.ticks = 0;
        this.millis = 0;
    }
    Console3LoggedEntity.prototype.getObject = function () {
        if (this.property) {
            return this.source[this.property];
        }
        return this.source;
    };
    Console3LoggedEntity.prototype.getLinkedMesh = function () {
        return this.getObject();
    };
    Console3LoggedEntity.prototype.debug = function (debugWhen) {
        this.debugWhen = debugWhen;
        return this;
    };
    Console3LoggedEntity.prototype.highlite = function (highliteWhen) {
        this.highliteWhen = highliteWhen;
        return this;
    };
    return Console3LoggedEntity;
}());
var console3 = /** @class */ (function () {
    function console3(_engine, _scene, options, _gui) {
        var _this = this;
        var _a;
        this._engine = _engine;
        this._scene = _scene;
        this._gui = _gui;
        this._entities = new Map();
        this._consoleEntities = [];
        this._consoleLineControls = [];
        this._consolePaused = false;
        this._consoleVisible = true;
        this._consoleLinesVisible = true;
        this._entityTypeMappings = new Map();
        this._side = Side.Right;
        this._ticks = 0;
        this._timeSpawned = 0;
        this._sharedMaterials = new Map();
        this._timeSpawned = Date.now();
        this._gui =
            (_a = this._gui) !== null && _a !== void 0 ? _a : BABYLON_GUI.AdvancedDynamicTexture.CreateFullscreenUI("Console3UI", true, this._scene);
        this._options = options
            ? __assign(__assign({}, DefaultConsole3Options), options) : __assign({}, DefaultConsole3Options);
        this._createSharedMaterials();
        this._createMappings();
        this._createMainPanel();
        this._createConsolePanel();
        this._createButtons();
        this._scene.onBeforeRenderObservable.add(function () {
            if (!_this._consolePaused) {
                _this._draw();
            }
            // this._offsetInPixelsIfSceneExplorer();
        });
    }
    console3.create = function (engine, scene, options, gui) {
        if (!console3.instance) {
            console3.instance = new console3(engine, scene, options, gui);
        }
        return console3.instance;
    };
    console3.log = function (object, property) {
        var _a;
        if (property === void 0) { property = ""; }
        var name = "default";
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._log0(name, object, property, 1);
    };
    console3.logv = function (name, vectors, property) {
        var _a;
        if (property === void 0) { property = ""; }
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._logv(name, vectors, property, 1);
    };
    console3.logd = function (name, object, property) {
        var _a;
        if (property === void 0) { property = ""; }
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._logd(name, object, property, 1);
    };
    console3.logd5 = function (name, object, property) {
        var _a;
        if (property === void 0) { property = ""; }
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._logd(name, object, property, 5);
    };
    console3.logd30 = function (name, object, property) {
        var _a;
        if (property === void 0) { property = ""; }
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._logd(name, object, property, 30);
    };
    console3.logd60 = function (name, object, property) {
        var _a;
        if (property === void 0) { property = ""; }
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._logd(name, object, property, 60);
    };
    console3.logd120 = function (name, object, property) {
        var _a;
        if (property === void 0) { property = ""; }
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._logd(name, object, property, 120);
    };
    // floating
    console3.logf = function (name, object, property) {
        var _a;
        if (property === void 0) { property = ""; }
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._logf(name, object, property, 1);
    };
    console3.logf5 = function (name, object, property) {
        var _a;
        if (property === void 0) { property = ""; }
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._logf(name, object, property, 5);
    };
    console3.logf30 = function (name, object, property) {
        var _a;
        if (property === void 0) { property = ""; }
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._logf(name, object, property, 30);
    };
    console3.logf60 = function (name, object, property) {
        var _a;
        if (property === void 0) { property = ""; }
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._logf(name, object, property, 60);
    };
    console3.logf120 = function (name, object, property) {
        var _a;
        if (property === void 0) { property = ""; }
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._logf(name, object, property, 120);
    };
    console3.getTicks = function () {
        var _a;
        return (_a = console3.instance) === null || _a === void 0 ? void 0 : _a._ticks;
    };
    console3.getTime = function () {
        var _a;
        return Date.now() - ((_a = console3.instance) === null || _a === void 0 ? void 0 : _a._timeSpawned);
    };
    console3.getTimeFormatted = function (time) {
        var t = time !== null && time !== void 0 ? time : console3.getTime();
        var t1000 = t / 1000;
        var millis = t1000 - Math.floor(t1000);
        var secs = Math.floor(t1000);
        var t60000 = t / 60000;
        var mins = Math.floor(t60000);
        var minsLabel = mins > 0 ? mins.toString() : "0";
        var secsLabel = secs > 0 ? secs.toString() : "0";
        var millisLabel = Math.floor(millis * 1000).toString();
        var timeFormatted = (mins < 10 ? "0" + minsLabel : minsLabel) +
            ":" +
            (secs < 10 ? "0" + secsLabel : secsLabel) +
            "." +
            millisLabel;
        return timeFormatted;
    };
    console3.prototype._createSharedMaterials = function () {
        var matVectorArrayLine = new BABYLON.StandardMaterial("console3-shared-material-vector3-array-line", this._scene);
        matVectorArrayLine.emissiveColor = new BABYLON.Color3(0, 0.4, 0);
        matVectorArrayLine.alpha = 0.4;
        this._setSharedMaterial(SharedMaterials.Vector3ArrayLine, matVectorArrayLine);
        var matVectorArrayMarker = new BABYLON.StandardMaterial("console3-shared-material-vector3-array-marker", this._scene);
        matVectorArrayMarker.emissiveColor = new BABYLON.Color3(0.4, 0, 0);
        matVectorArrayMarker.alpha = 0.4;
        this._setSharedMaterial(SharedMaterials.Vector3ArrayMarker, matVectorArrayMarker);
    };
    console3.prototype._setSharedMaterial = function (materialKey, material) {
        this._sharedMaterials.set(materialKey, material);
    };
    console3.prototype._getSharedMaterial = function (materialKey) {
        var _a;
        return (_a = this._sharedMaterials.get(materialKey)) !== null && _a !== void 0 ? _a : null;
    };
    console3.prototype._createMappings = function () {
        var _this = this;
        var entityTypeMappings = new Map();
        entityTypeMappings.set(Console3LoggedEntityType.Text, {
            color: new BABYLON.Color3(0.4, 0.4, 0.4),
            drawFunction: function (entity) { return _this._drawText(entity); }
        });
        entityTypeMappings.set(Console3LoggedEntityType.Float, {
            color: new BABYLON.Color3(0.6, 0.6, 0.9),
            drawFunction: function (entity) { return _this._drawFloat(entity); }
        });
        entityTypeMappings.set(Console3LoggedEntityType.Boolean, {
            color: new BABYLON.Color3(0.9, 0.6, 0.6),
            drawFunction: function (entity) { return _this._drawBoolean(entity); }
        });
        entityTypeMappings.set(Console3LoggedEntityType.Mesh, {
            color: new BABYLON.Color3(0.0, 0.1, 0.7),
            drawFunction: function (entity) { return _this._drawMesh(entity); }
        });
        entityTypeMappings.set(Console3LoggedEntityType.Vector2, {
            color: new BABYLON.Color3(0.0, 0.7, 0.1),
            drawFunction: function (entity) { return _this._drawVector2(entity); }
        });
        entityTypeMappings.set(Console3LoggedEntityType.Vector3, {
            color: new BABYLON.Color3(0.0, 0.7, 0.1),
            drawFunction: function (entity) { return _this._drawVector3(entity); }
        });
        entityTypeMappings.set(Console3LoggedEntityType.Color3, {
            color: new BABYLON.Color3(0.0, 0.0, 0.0),
            drawFunction: function (entity) { return _this._drawColor3(entity); }
        });
        entityTypeMappings.set(Console3LoggedEntityType.Color4, {
            color: new BABYLON.Color3(0.0, 0.0, 0.0),
            drawFunction: function (entity) { return _this._drawColor4(entity); }
        });
        entityTypeMappings.set(Console3LoggedEntityType.Vector3Array, {
            color: new BABYLON.Color3(0.0, 0.0, 0.0),
            drawFunction: function (entity) { return _this._drawVector3Array(entity); }
        });
        this._entityTypeMappings = entityTypeMappings;
    };
    console3.prototype._drawText = function (entity) {
        if (entity.textInputs) {
            entity.textInputs[0].text = console3._getObject(entity);
        }
    };
    console3.prototype._drawFloat = function (entity) {
        if (entity.textInputs) {
            entity.textInputs[0].text = console3
                ._getObject(entity)
                .toString();
        }
    };
    console3.prototype._drawBoolean = function (entity) {
        if (entity.textInputs) {
            entity.textInputs[0].text = console3
                ._getObject(entity)
                .toString();
        }
    };
    console3.prototype._drawMesh = function (entity) {
        if (entity.textInputs) {
            var obj = console3._getObject(entity);
            entity.textInputs[0].text = obj.position.x.toFixed(this._options.floatPrecision) + ", " + obj.position.y.toFixed(this._options.floatPrecision) + ", " + obj.position.z.toFixed(this._options.floatPrecision) + " ";
            entity.textInputs[1].text = obj.rotation.x.toFixed(this._options.floatPrecision) + ", " + obj.rotation.y.toFixed(this._options.floatPrecision) + ", " + obj.rotation.z.toFixed(this._options.floatPrecision) + " ";
            entity.textInputs[2].text = obj.scaling.x.toFixed(this._options.floatPrecision) + ", " + obj.scaling.y.toFixed(this._options.floatPrecision) + ", " + obj.scaling.z.toFixed(this._options.floatPrecision) + " ";
        }
    };
    console3.prototype._drawVector2 = function (entity) {
        if (entity.textInputs) {
            var obj = console3._getObject(entity);
            entity.textInputs[0].text = obj.x.toFixed(this._options.floatPrecision) + ", " + obj.y.toFixed(this._options.floatPrecision);
        }
    };
    console3.prototype._drawVector3 = function (entity) {
        if (entity.textInputs) {
            var obj = console3._getObject(entity);
            entity.textInputs[0].text = obj.x.toFixed(this._options.floatPrecision) + ", " + obj.y.toFixed(this._options.floatPrecision) + ", " + obj.z.toFixed(this._options.floatPrecision);
        }
    };
    console3.prototype._drawVector3Array = function (entity) {
        var _this = this;
        // TODO: create object pool
        var markers = this._scene.meshes.filter(function (m) { return m.name.indexOf("console3-vector-array-marker") > -1; });
        markers.forEach(function (m) {
            m.dispose();
        });
        var vectors = console3._getObject(entity);
        // tubes
        var tube = BABYLON.MeshBuilder.CreateTube("console3-vector-array-marker", { path: vectors, radius: 0.01, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, this._scene);
        tube.material = this._getSharedMaterial(SharedMaterials.Vector3ArrayLine);
        // marker points
        vectors.forEach(function (v, idx) {
            var arrayVectorMarker = BABYLON.Mesh.CreateSphere("console3-vector-array-marker-" + idx, 8, 0.08, _this._scene);
            arrayVectorMarker.position = v;
            arrayVectorMarker.material = _this._getSharedMaterial(SharedMaterials.Vector3ArrayMarker);
        });
    };
    console3.prototype._drawColor3 = function (entity) {
        if (entity.textInputs) {
            var obj = console3._getObject(entity);
            entity.textInputs[0].text = obj.r.toFixed(this._options.floatPrecision) + ", " + obj.g.toFixed(this._options.floatPrecision) + ", " + obj.b.toFixed(this._options.floatPrecision);
            this._setColorEntityColor(entity.name, obj);
        }
    };
    console3.prototype._drawColor4 = function (entity) {
        if (entity.textInputs) {
            var obj = console3._getObject(entity);
            entity.textInputs[0].text = obj.r.toFixed(this._options.floatPrecision) + ", " + obj.g.toFixed(this._options.floatPrecision) + ", " + obj.b.toFixed(this._options.floatPrecision) + ", , " + obj.a.toFixed(this._options.floatPrecision);
            this._setColorEntityColor(entity.name, obj);
        }
    };
    // Visual Console private methods
    console3.prototype._offsetInPixelsIfSceneExplorer = function () {
        var _a, _b;
        var sceneExplorerHost = document.getElementById("BABYLON.sceneExplorer");
        var inspectorHost = document.getElementById("actionTabs");
        var sceneExplorerOffset = (_a = sceneExplorerHost === null || sceneExplorerHost === void 0 ? void 0 : sceneExplorerHost.clientWidth) !== null && _a !== void 0 ? _a : 0;
        var inspectorOffset = (_b = inspectorHost === null || inspectorHost === void 0 ? void 0 : inspectorHost.clientWidth) !== null && _b !== void 0 ? _b : 0;
        this._mainPanel.paddingRightInPixels = 0;
        this._mainPanel.paddingLeftInPixels = 0;
        if (this._side === Side.Left && sceneExplorerHost) {
            this._mainPanel.paddingLeftInPixels = sceneExplorerOffset;
            this._mainPanel.paddingRightInPixels = 0;
            this._consoleLinesPanel.paddingLeftInPixels = sceneExplorerOffset;
            this._consoleLinesPanel.paddingRightInPixels = 0;
        }
        else if (this._side === Side.Right && inspectorHost) {
            this._mainPanel.paddingLeftInPixels = 0;
            this._mainPanel.paddingRightInPixels = inspectorOffset;
            this._consoleLinesPanel.paddingLeftInPixels = 0;
            this._consoleLinesPanel.paddingRightInPixels = inspectorOffset;
        }
    };
    console3.prototype._createConsolePanel = function () {
        if (this._gui) {
            var scrollViewer = new BABYLON_GUI.ScrollViewer();
            this._scrollViewer = scrollViewer;
            scrollViewer.thickness = 0;
            scrollViewer.alpha = this._options.consolePanelAlpha;
            scrollViewer.width = this._options.consolePanelWidth;
            scrollViewer.heightInPixels = this._options.consolePanelHeightInPixels;
            scrollViewer.verticalAlignment =
                BABYLON_GUI.StackPanel.VERTICAL_ALIGNMENT_BOTTOM;
            scrollViewer.forceVerticalBar = true;
            var consolePanel = new BABYLON_GUI.StackPanel();
            this._consoleLinesPanel = consolePanel;
            consolePanel.name = "console3-console-lines-panel";
            consolePanel.paddingBottomInPixels = 4;
            consolePanel.zIndex = 1;
            consolePanel.alpha = this._options.consolePanelAlpha;
            this._createConsoleLines(consolePanel);
            this._gui.addControl(scrollViewer);
            scrollViewer.addControl(consolePanel);
        }
    };
    console3.prototype._createMainPanel = function () {
        var _a;
        this._mainPanel = new BABYLON_GUI.StackPanel("console3-main-panel");
        this._mainPanel.horizontalAlignment =
            BABYLON_GUI.StackPanel.HORIZONTAL_ALIGNMENT_RIGHT;
        this._mainPanel.verticalAlignment =
            BABYLON_GUI.StackPanel.VERTICAL_ALIGNMENT_TOP;
        this._mainPanel.width = this._options.mainPanelWidth;
        // this._mainPanel.height = 1
        (_a = this._gui) === null || _a === void 0 ? void 0 : _a.addControl(this._mainPanel);
    };
    console3.prototype._createButtons = function () {
        var buttonPanel = new BABYLON_GUI.StackPanel("console3-button-panel");
        buttonPanel.isVertical = false;
        buttonPanel.horizontalAlignment =
            BABYLON_GUI.StackPanel.HORIZONTAL_ALIGNMENT_RIGHT;
        buttonPanel.verticalAlignment =
            BABYLON_GUI.StackPanel.VERTICAL_ALIGNMENT_TOP;
        buttonPanel.widthInPixels = 120;
        buttonPanel.heightInPixels = 40;
        this._buttonPanel = buttonPanel;
        this._mainPanel.addControl(buttonPanel);
        // this._createSideToggleButton(buttonPanel);
        this._createInspectorButton(buttonPanel);
        this._createConsoleLinesToggleButton(buttonPanel);
        this._createConsoleToggleButton(buttonPanel);
        this._createPauseButton(buttonPanel);
    };
    console3.prototype._createInspectorButton = function (parent) {
        var _this = this;
        var btn = BABYLON_GUI.Button.CreateSimpleButton("console3-button-inspector-toggle", "D");
        btn.widthInPixels = 28;
        btn.heightInPixels = 24;
        btn.color = "white";
        btn.fontSize = 12;
        btn.background = "#222";
        btn.paddingRightInPixels = 4;
        btn.horizontalAlignment = BABYLON_GUI.Button.HORIZONTAL_ALIGNMENT_RIGHT;
        btn.onPointerUpObservable.add(function () {
            var isVisible = _this._scene.debugLayer.isVisible();
            if (isVisible) {
                void _this._scene.debugLayer.hide();
            }
            else {
                void _this._scene.debugLayer.show({
                    embedMode: false,
                    overlay: false
                });
            }
            // this._BABYLON.scene.debugLayer.select();
        });
        parent.addControl(btn);
    };
    console3.prototype._createConsoleLinesToggleButton = function (parent) {
        var _this = this;
        var btn = BABYLON_GUI.Button.CreateSimpleButton("console3-buttton-console-lines-toggle", "C");
        btn.widthInPixels = 28;
        btn.heightInPixels = 24;
        btn.color = "white";
        btn.fontSize = 12;
        btn.background = "#444";
        btn.paddingRightInPixels = 4;
        btn.onPointerUpObservable.add(function () {
            _this._consoleLinesVisible = !_this._consoleLinesVisible;
        });
        parent.addControl(btn);
    };
    console3.prototype._createConsoleToggleButton = function (parent) {
        var _this = this;
        var btn = BABYLON_GUI.Button.CreateSimpleButton("console3-button-console-toggle", "O");
        btn.widthInPixels = 28;
        btn.heightInPixels = 24;
        btn.color = "white";
        btn.fontSize = 12;
        btn.background = "#666";
        btn.paddingRightInPixels = 4;
        btn.onPointerUpObservable.add(function () {
            _this._consoleVisible = !_this._consoleVisible;
        });
        parent.addControl(btn);
    };
    console3.prototype._createPauseButton = function (parent) {
        var _this = this;
        var btn = BABYLON_GUI.Button.CreateSimpleButton("console3-button-console-pause", "P");
        btn.widthInPixels = 28;
        btn.heightInPixels = 24;
        btn.color = "white";
        btn.fontSize = 12;
        btn.background = "#844";
        btn.onPointerUpObservable.add(function () {
            _this._consolePaused = !_this._consolePaused;
        });
        parent.addControl(btn);
    };
    console3.prototype._createSideToggleButton = function (parent) {
        var _this = this;
        var btn = BABYLON_GUI.Button.CreateSimpleButton("console3-button-side-toggle", ">");
        btn.widthInPixels = 28;
        btn.heightInPixels = 24;
        btn.color = "white";
        btn.fontSize = 12;
        btn.background = "#444";
        btn.rotation = Math.PI;
        btn.paddingRightInPixels = 4;
        btn.horizontalAlignment = BABYLON_GUI.Button.HORIZONTAL_ALIGNMENT_RIGHT;
        btn.onPointerUpObservable.add(function () {
            var _a;
            var existingControls = (_a = _this._gui) === null || _a === void 0 ? void 0 : _a.getDescendants();
            if (_this._side === Side.Left) {
                btn.rotation = Math.PI;
                btn.horizontalAlignment = BABYLON_GUI.Button.HORIZONTAL_ALIGNMENT_RIGHT;
                _this._mainPanel.horizontalAlignment =
                    BABYLON_GUI.StackPanel.HORIZONTAL_ALIGNMENT_RIGHT;
                _this._buttonPanel.horizontalAlignment =
                    BABYLON_GUI.StackPanel.HORIZONTAL_ALIGNMENT_RIGHT;
            }
            else {
                btn.rotation = 0;
                btn.horizontalAlignment = BABYLON_GUI.Button.HORIZONTAL_ALIGNMENT_LEFT;
                _this._mainPanel.horizontalAlignment =
                    BABYLON_GUI.StackPanel.HORIZONTAL_ALIGNMENT_LEFT;
                _this._buttonPanel.horizontalAlignment =
                    BABYLON_GUI.StackPanel.HORIZONTAL_ALIGNMENT_LEFT;
            }
            _this._entities.forEach(function (e) {
                if (e.options.docked) {
                    var panel = existingControls === null || existingControls === void 0 ? void 0 : existingControls.find(function (c) { return c.name == "console3-panel-" + e.name; });
                    if (panel) {
                        if (_this._side === Side.Left) {
                            panel.horizontalAlignment =
                                BABYLON_GUI.TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
                        }
                        else {
                            panel.horizontalAlignment =
                                BABYLON_GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
                        }
                    }
                }
            });
            _this._side = _this._side === Side.Left ? Side.Right : Side.Left;
        });
        parent.addControl(btn);
    };
    console3.prototype._addObjectEntity = function (name, object, property, options) {
        var _this = this;
        var _a;
        var type = Console3LoggedEntityType.Text;
        var inputCount = 1;
        var value = property !== "" ? object[property] : object;
        var objType = typeof value;
        if (objType === "object") {
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    if (value[0] instanceof BABYLON.Vector3) {
                        type = Console3LoggedEntityType.Vector3Array;
                    }
                }
            }
            else {
                if (value instanceof BABYLON.Vector3) {
                    type = Console3LoggedEntityType.Vector3;
                }
                else if (value instanceof BABYLON.Color3) {
                    type = Console3LoggedEntityType.Color3;
                }
                else if (value instanceof BABYLON.AbstractMesh) {
                    type = Console3LoggedEntityType.Mesh;
                    inputCount = 3;
                }
            }
        }
        else if (objType === "string") {
            type = Console3LoggedEntityType.Text;
        }
        else if (objType === "number") {
            type = Console3LoggedEntityType.Float;
        }
        else if (objType === "boolean") {
            type = Console3LoggedEntityType.Boolean;
        }
        var DEFAULT_MAPPING = {
            color: new BABYLON.Color3(0.4, 0.4, 0.4),
            drawFunction: function (e) { return _this._drawText(e); }
        };
        var mapping = (_a = this._entityTypeMappings.get(type)) !== null && _a !== void 0 ? _a : DEFAULT_MAPPING;
        options.mapping = mapping;
        var entity = new Console3LoggedEntity(name, type, object, property, options);
        if (options.console === true) {
            entity.ticks = this._ticks;
            this._addConsoleLine(entity);
        }
        else {
            this._entities.set(name, entity);
            this._addObserverFrame(entity, inputCount);
        }
        return entity;
    };
    console3.prototype._log0 = function (name, object, property, refreshRate) {
        var docked = true;
        var entity = this._addObjectEntity(name, object, property, {
            docked: docked,
            console: true
        });
        entity.refreshRate = refreshRate;
        return entity;
    };
    console3.prototype._logv = function (name, object, property, refreshRate) {
        var docked = false;
        var entity = this._entities.get(name);
        if (!entity) {
            entity = this._addObjectEntity(name, object, property, {
                docked: docked,
                console: false
            });
        }
        else {
            entity.source = object;
            entity.property = property;
            entity.options.docked = docked;
        }
        entity.refreshRate = refreshRate;
        return entity;
    };
    console3.prototype._logd = function (name, object, property, refreshRate) {
        var docked = true;
        var entity = this._entities.get(name);
        if (!entity) {
            entity = this._addObjectEntity(name, object, property, {
                docked: docked,
                console: false
            });
        }
        else {
            entity.source = object;
            entity.property = property;
            entity.options.docked = docked;
        }
        entity.refreshRate = refreshRate;
        return entity;
    };
    console3.prototype._logf = function (name, object, property, refreshRate) {
        var docked = false;
        var entity = this._entities.get(name);
        if (!entity) {
            entity = this._addObjectEntity(name, object, property, {
                docked: docked,
                console: false,
                linkedWithMesh: true
            });
        }
        else {
            console.warn("console3: entity", name, "already exists.");
            entity.source = object;
            entity.property = property;
            entity.options.docked = docked;
        }
        entity.refreshRate = refreshRate;
        return entity;
    };
    console3.prototype._setColorEntityColor = function (key, color) {
        var existingControls = this._gui.getDescendants();
        var control = existingControls.find(function (c) { return c.name === "console3-observer-panel-" + key; });
        if (control instanceof BABYLON_GUI.StackPanel) {
            control.background = "rgb(" + color.r * 255 + "," + color.g * 255 + "," + color.b * 255 + ")";
        }
    };
    console3._getObject = function (entity) {
        if (entity.property) {
            return entity.source[entity.property];
        }
        return entity.source;
    };
    console3.prototype._draw = function () {
        if (!this._gui) {
            return;
        }
        this._showConsole();
        this._showConsoleLines();
        this._drawEntites();
        this._drawConsoleLines();
        this._ticks++;
    };
    console3.prototype._showConsoleLines = function () {
        this._consoleLinesPanel.isVisible = this._consoleLinesVisible;
    };
    console3.prototype._showConsole = function () {
        var _this = this;
        var _a;
        var controls = (_a = this._gui) === null || _a === void 0 ? void 0 : _a.getDescendants();
        controls === null || controls === void 0 ? void 0 : controls.forEach(function (c) {
            if (c === null || c === void 0 ? void 0 : c.name) {
                if (c.name.indexOf("console3-observer-panel-") > -1 ||
                    c.name.indexOf("console3-line-") > -1) {
                    c.isVisible = _this._consoleVisible;
                }
            }
        });
    };
    console3.prototype._drawEntites = function () {
        var _this = this;
        this._entities.forEach(function (e) {
            var _a;
            if (_this._ticks % e.refreshRate === 0) {
                var drawFunction = (_a = _this._entityTypeMappings.get(e.type)) === null || _a === void 0 ? void 0 : _a.drawFunction;
                if (drawFunction) {
                    drawFunction(e);
                }
            }
            var val = e.getObject();
            if (e.debugWhen && e.debugWhen(val)) {
                _this._setColorEntityColor(e.name, _this._options.debuggerHitPanelColor);
                debugger;
            }
            if (e.highliteWhen && e.highliteWhen(val)) {
                _this._setColorEntityColor(e.name, _this._options.highliteHitPanelColor);
            }
        });
    };
    console3.prototype._drawConsoleLines = function () {
        if (this._consoleLinesVisible === false) {
            this._scrollViewer.isVisible = false;
            return;
        }
        if (this._gui) {
            var linesCount = this._consoleEntities.length;
            var controlsCount = this._consoleLineControls.length;
            var drawCount = Math.min(controlsCount, linesCount);
            if (drawCount === 0) {
                this._scrollViewer.isVisible = false;
            }
            else {
                this._scrollViewer.isVisible = true;
            }
            for (var i = 0; i < drawCount; i++) {
                var lineControl = this._consoleLineControls[this._options.maxConsoleLineEntities - 1 - i];
                if (lineControl) {
                    var entity = this._consoleEntities[linesCount - i - 1];
                    lineControl.text =
                        entity.ticks.toString() +
                            // " | " +
                            // console3.getTimeFormatted() +
                            " : " +
                            entity.getObject();
                }
            }
            if (drawCount < this._options.maxConsoleLineEntities) {
                this._scrollViewer.verticalBar.value = 1;
            }
        }
    };
    console3.prototype._createConsoleLines = function (consolePanel) {
        if (this._gui) {
            for (var i = 0; i < this._options.maxConsoleLineEntities; i++) {
                var textValue = new BABYLON_GUI.InputText();
                textValue.width = 1;
                textValue.heightInPixels = this._options.consoleLineHeightInPixels;
                textValue.thickness = 0;
                textValue.text = "";
                textValue.color = "white";
                textValue.fontSize = 12;
                textValue.name = "console3-line-" + i;
                consolePanel.addControl(textValue);
                this._consoleLineControls.push(textValue);
            }
            // const color = this._entityTypeMappings.get(entity.type)?.color ?? OBSERVER_PANEL_COLOR
            // this._setColorEntityColor(entity.name, color)
        }
    };
    console3.prototype._addConsoleLine = function (entity) {
        if (this._consoleEntities.length >= this._options.maxConsoleLineEntities) {
            this._consoleEntities.shift();
        }
        this._consoleEntities.push(entity);
    };
    console3.prototype._addObserverFrame = function (entity, inputCount) {
        var _a, _b, _c, _d;
        if (inputCount === void 0) { inputCount = 1; }
        if (this._gui) {
            var parentPanel = new BABYLON_GUI.StackPanel();
            parentPanel.name = "console3-observer-panel-" + entity.name;
            parentPanel.horizontalAlignment =
                BABYLON_GUI.StackPanel.HORIZONTAL_ALIGNMENT_RIGHT;
            parentPanel.verticalAlignment =
                BABYLON_GUI.StackPanel.VERTICAL_ALIGNMENT_TOP;
            parentPanel.widthInPixels =
                (_b = (_a = entity.options.mapping) === null || _a === void 0 ? void 0 : _a.widthInPixels) !== null && _b !== void 0 ? _b : this._options.observerPanelWidthInPixels;
            parentPanel._automaticSize = true;
            parentPanel.background = "#666";
            parentPanel.paddingBottomInPixels = 4;
            parentPanel.zIndex = 1;
            parentPanel.alpha = this._options.mainPanelAlpha;
            if (entity.options.linkedWithMesh === true) {
                this._gui.addControl(parentPanel);
                var mesh = entity.getLinkedMesh();
                if (mesh) {
                    parentPanel.linkWithMesh(mesh);
                    entity.options.linkedWithMesh = true;
                }
                parentPanel.paddingTopInPixels = 0;
                var line = new BABYLON_GUI.Line("line-" + entity.name);
                line.lineWidth = 2;
                line.dash = [3, 3];
                line.color = "white";
                line.y2 = 20;
                line.zIndex = 0;
                line.linkOffsetY = -20;
                line.alpha = this._options.linesAlpha;
                this._gui.addControl(line);
                line.linkWithMesh(mesh);
                line.connectedControl = parentPanel;
                parentPanel.linkOffsetX = this._options.meshBadgeLinkXOffsetInPixels;
                parentPanel.linkOffsetY = this._options.meshBadgeLinkYOffsetInPixels;
            }
            var textLabel = new BABYLON_GUI.TextBlock();
            textLabel.paddingBottomInPixels = 2;
            textLabel.paddingTopInPixels = 2;
            textLabel.paddingLeftInPixels = 2;
            textLabel.paddingRightInPixels = 2;
            textLabel.text = entity.name;
            textLabel.color = "white";
            textLabel.fontSize = 12;
            textLabel.resizeToFit = true;
            textLabel.name = "console3-textLabel-" + entity.name;
            textLabel.horizontalAlignment =
                BABYLON_GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
            parentPanel.addControl(textLabel);
            for (var i = 0; i < inputCount; i++) {
                var textValue = new BABYLON_GUI.InputText();
                textValue.width = 0.98;
                textValue.height = "24px";
                textValue.text = "";
                textValue.color = "white";
                textValue.background = "#222";
                textValue.fontSize = 12;
                textValue.name = "console3-textValue-" + entity.name + "-" + i;
                textValue.horizontalAlignment =
                    BABYLON_GUI.TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
                entity.textInputs.push(textValue);
                parentPanel.addControl(textValue);
            }
            if (entity.options.docked) {
                this._mainPanel.addControl(parentPanel);
            }
            var color = (_d = (_c = this._entityTypeMappings.get(entity.type)) === null || _c === void 0 ? void 0 : _c.color) !== null && _d !== void 0 ? _d : this._options.observerPanelColor;
            this._setColorEntityColor(entity.name, color);
        }
    };
    return console3;
}());
window.console3 = console3;
