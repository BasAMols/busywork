var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// ts/classes/math/vector2.ts
var Vector2 = class _Vector2 {
  constructor(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : this.x;
  }
  clone() {
    return new _Vector2(this.x, this.y);
  }
  add(...v) {
    const dum = this.clone();
    v.forEach((v2) => {
      dum.x += v2.x;
      dum.y += v2.y;
    });
    return dum;
  }
  sub(...v) {
    const dum = this.clone();
    v.forEach((v2) => {
      dum.x -= v2.x;
      dum.y -= v2.y;
    });
    return dum;
  }
  scale(...s) {
    const dum = this.clone();
    s.forEach((s2) => {
      dum.x *= s2;
      dum.y *= s2;
    });
    return dum;
  }
  div(...v) {
    const dum = this.clone();
    v.forEach((v2) => {
      if (v2 === 0) {
        dum.x = 0;
        dum.y = 0;
      } else {
        dum.x /= v2;
        dum.y /= v2;
      }
    });
    return dum;
  }
  cross(v) {
    return this.x * v.y - this.y * v.x;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  distance(v) {
    return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
  }
  angle() {
    return Math.atan2(this.y, this.x) * 180 / Math.PI + 90;
  }
  rotate(angle) {
    const dum = this.clone();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    dum.x = this.x * cos - this.y * sin;
    dum.y = this.x * sin + this.y * cos;
    return dum;
  }
  lerp(v, t) {
    const dum = this.clone();
    dum.x = this.x + (v.x - this.x) * t;
    dum.y = this.y + (v.y - this.y) * t;
    return dum;
  }
  equals(v) {
    return this.x === v.x && this.y === v.y;
  }
  toString() {
    return "Vector2(".concat(this.x, ", ").concat(this.y, ")");
  }
  toArray() {
    return [this.x, this.y];
  }
  normalize() {
    const dum = this.clone();
    const len = Math.sqrt(dum.x * dum.x + dum.y * dum.y);
    dum.x /= len;
    dum.y /= len;
    return dum;
  }
  [Symbol.iterator]() {
    return this.toArray()[Symbol.iterator]();
  }
};

// ts/classes/math/transform.ts
var Transform = class {
  constructor(options = {}) {
    // size of the element
    this._responders = [];
    var _a, _b, _c, _d;
    this._position = (_a = options.position) != null ? _a : new Vector2(0, 0);
    this._scale = (_b = options.scale) != null ? _b : new Vector2(1, 1);
    this._rotation = (_c = options.rotation) != null ? _c : 0;
    this._anchor = (_d = options.anchor) != null ? _d : new Vector2(0, 0);
    this._size = options.size;
    this._parent = options.parent;
  }
  setParent(parent) {
    this._parent = parent;
    this._update();
  }
  hasParent() {
    return this._parent !== void 0;
  }
  setResponder(responder) {
    this._responders.push(responder);
    responder({ position: this.position, scale: this.scale, rotation: this.rotation, matrix: this.matrix, size: this._size });
  }
  get position() {
    return this._position;
  }
  get scale() {
    return this._scale;
  }
  get rotation() {
    return this._rotation % 360;
  }
  get anchor() {
    return this._anchor;
  }
  get size() {
    var _a;
    return (_a = this._size) != null ? _a : new Vector2(0, 0);
  }
  setPosition(position) {
    this._position = position;
    this._update();
  }
  getAbsolutePosition() {
    const localMatrix = this.getLocalMatrix();
    if (this._parent) {
      const parentAbsolute = this._parent.getAbsolutePosition();
      const absoluteMatrix = this.multiplyMatrices(parentAbsolute.matrix, localMatrix);
      const absolutePosition = this.transformPointThroughParent(this._position, parentAbsolute);
      const absoluteScale = new Vector2(
        this._scale.x * parentAbsolute.scale.x,
        this._scale.y * parentAbsolute.scale.y
      );
      const absoluteRotation = (this._rotation + parentAbsolute.rotation) % 360;
      return {
        position: absolutePosition,
        scale: absoluteScale,
        rotation: absoluteRotation,
        matrix: absoluteMatrix
      };
    }
    return {
      position: this._position.clone(),
      scale: this._scale.clone(),
      rotation: this._rotation,
      matrix: localMatrix
    };
  }
  transformPointThroughParent(point, parentAbsolute) {
    const radians = parentAbsolute.rotation * (Math.PI / 180);
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const scaledX = point.x * parentAbsolute.scale.x;
    const scaledY = point.y * parentAbsolute.scale.y;
    const rotatedX = scaledX * cos - scaledY * sin;
    const rotatedY = scaledX * sin + scaledY * cos;
    return new Vector2(
      rotatedX + parentAbsolute.position.x,
      rotatedY + parentAbsolute.position.y
    );
  }
  getLocalMatrix() {
    var _a, _b, _c, _d;
    const radiansRotation = this._rotation * (Math.PI / 180);
    const cos = Math.cos(radiansRotation);
    const sin = Math.sin(radiansRotation);
    const anchorX = this._anchor.x * ((_b = (_a = this._size) == null ? void 0 : _a.x) != null ? _b : 0);
    const anchorY = this._anchor.y * ((_d = (_c = this._size) == null ? void 0 : _c.y) != null ? _d : 0);
    const scaleX = this._scale.x;
    const scaleY = this._scale.y;
    const a = scaleX * cos;
    const b = scaleX * sin;
    const c = -scaleY * sin;
    const d = scaleY * cos;
    const tx = this._position.x + anchorX - (a * anchorX + c * anchorY);
    const ty = this._position.y + anchorY - (b * anchorX + d * anchorY);
    return [
      a,
      b,
      0,
      0,
      c,
      d,
      0,
      0,
      0,
      0,
      1,
      0,
      tx,
      ty,
      0,
      1
    ];
  }
  multiplyMatrices(a, b) {
    const result = new Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i * 4 + j] = a[i * 4 + 0] * b[0 * 4 + j] + a[i * 4 + 1] * b[1 * 4 + j] + a[i * 4 + 2] * b[2 * 4 + j] + a[i * 4 + 3] * b[3 * 4 + j];
      }
    }
    return result;
  }
  get absolute() {
    return this.getAbsolutePosition();
  }
  setScale(scale, scaleY) {
    if (typeof scale === "number") {
      this._scale = new Vector2(scale, scaleY != null ? scaleY : scale);
    } else {
      this._scale = scale;
    }
    this._update();
  }
  setRotation(rotation) {
    this._rotation = rotation;
    this._update();
  }
  setAnchor(anchor) {
    this._anchor = anchor;
    this._update();
  }
  setSize(size) {
    this._size = size;
    this._update();
  }
  get matrix() {
    return this.getLocalMatrix();
  }
  _update() {
    this._responders.forEach((responder) => {
      responder({ position: this.position, scale: this.scale, rotation: this.rotation, matrix: this.matrix, size: this._size });
    });
  }
  setMatrix(matrix) {
    if (matrix.length !== 16) {
      throw new Error("Matrix must be a 16-element array representing a 4x4 matrix");
    }
    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[4];
    const d = matrix[5];
    const tx = matrix[12];
    const ty = matrix[13];
    const scaleX = Math.sqrt(a * a + b * b);
    const scaleY = Math.sqrt(c * c + d * d);
    const rotation = Math.atan2(b, a) * (180 / Math.PI);
    const anchorX = this._anchor.x * this._size.x;
    const anchorY = this._anchor.y * this._size.y;
    const positionX = tx - anchorX + (a * anchorX + c * anchorY);
    const positionY = ty - anchorY + (b * anchorX + d * anchorY);
    this._position = new Vector2(positionX, positionY);
    this._scale = new Vector2(scaleX, scaleY);
    this._rotation = rotation;
    this._update();
  }
  update() {
    this._update();
  }
};

// ts/classes/element/element.ts
var HTML = class {
  constructor(options = {}) {
    this.children = [];
    this.absolute = false;
    this._visible = true;
    var _a;
    this.options = options;
    this.type = this.options.type || "div";
    this.dom = document.createElement(this.type);
    this.dom.classList.add("_element", "_" + this.type);
    if (this.options.classList) {
      this.options.classList.forEach((className) => {
        this.dom.classList.add(className);
      });
    }
    if (this.options.text) {
      this.setText(this.options.text);
    }
    if ((_a = this.options.transform) == null ? void 0 : _a.size) {
      this.setStyle({
        width: this.options.transform.size.x + "px",
        height: this.options.transform.size.y + "px"
      });
    }
    this.setStyle(this.options.style);
    this.transform = new Transform(this.options.transform);
    this.transform.setResponder(({ matrix, position, scale, rotation, size }) => {
      this.dom.style.transformOrigin = "0 0";
      this.dom.style.transform = "matrix3d(".concat(matrix.join(","), ")");
      if (size) {
        this.dom.style.width = size.x + "px";
        this.dom.style.height = size.y + "px";
      }
    });
    if (options.onMouseDown) {
      this.dom.addEventListener("pointerdown", (e) => {
        this.options.onMouseDown(e, this);
      });
    }
    if (options.onMouseUp) {
      this.dom.addEventListener("pointerup", (e) => {
        this.options.onMouseUp(e, this);
      });
    }
    if (options.onMouseMove) {
      this.dom.addEventListener("pointermove", (e) => {
        this.options.onMouseMove(e, this);
      });
    }
    if (options.onMouseEnter) {
      this.dom.addEventListener("pointerenter", (e) => {
        this.options.onMouseEnter(e, this);
      });
    }
    if (options.onMouseLeave) {
      this.dom.addEventListener("pointerleave", (e) => {
        this.options.onMouseLeave(e, this);
      });
    }
    this.setText(this.options.text);
    if (options.children) {
      options.children.forEach((child) => {
        this.append(child);
      });
    }
  }
  append(element, absolute = this.absolute) {
    this.dom.appendChild(element.dom);
    if (!element.transform.hasParent() && !absolute) {
      element.transform.setParent(this.transform);
    }
    this.children.push(element);
    return element;
  }
  remove() {
    this.dom.remove();
  }
  setStyle(style) {
    if (style) {
      Object.assign(this.dom.style, style);
    }
  }
  setText(text) {
    this.dom.textContent = text;
  }
  setHTML(html) {
    this.dom.innerHTML = html;
  }
  set visible(visible) {
    this._visible = visible;
    this.dom.style.display = visible ? "block" : "none";
  }
  get visible() {
    return this._visible;
  }
  set opacity(opacity) {
    this.dom.style.opacity = opacity.toString();
  }
  tick(obj) {
    if (this.visible) {
      this.children.forEach((child) => {
        child.tick(obj);
      });
    }
  }
};

// ts/classes/gridManager.ts
var GridManager = class {
  constructor(parent, sections = []) {
    this.parent = parent;
    this.sections = sections;
    this.animations = glob.bulkAnimations([{
      duration: 0,
      scale: 1e4,
      onChange: (value) => {
        this.parent.transform.setSize(new Vector2(value, this.parent.transform.size.y));
      }
    }, {
      duration: 0,
      scale: 1e4,
      onChange: (value) => {
        this.parent.transform.setSize(new Vector2(this.parent.transform.size.x, value));
      }
    }, {
      duration: 350,
      scale: 1e4,
      onChange: (value) => {
        this.parent.transform.setPosition(new Vector2(value, this.parent.transform.position.y));
      }
    }, {
      duration: 350,
      scale: 1e4,
      onChange: (value) => {
        this.parent.transform.setPosition(new Vector2(this.parent.transform.position.x, value));
      }
    }, {
      duration: 350,
      scale: 10,
      onChange: (value) => {
        this.parent.transform.setScale(new Vector2(value, value));
      }
    }]);
    this.tick(false);
  }
  tick(force = false) {
    let left, right, top, bottom;
    this.sections.forEach((section) => {
      section.updateGrid();
      if (section.gridData.size.x === 0 || section.gridData.size.y === 0) {
        return;
      }
      let width = section.gridData.size.x * section.gridData.scale.x;
      let height = section.gridData.size.y * section.gridData.scale.y;
      left = left === void 0 ? section.gridData.position.x : Math.min(left, section.gridData.position.x);
      right = right === void 0 ? section.gridData.position.x + width : Math.max(right, section.gridData.position.x + width);
      top = top === void 0 ? section.gridData.position.y : Math.min(top, section.gridData.position.y);
      bottom = bottom === void 0 ? section.gridData.position.y + height : Math.max(bottom, section.gridData.position.y + height);
    });
    const size = new Vector2(right - left, bottom - top);
    const windowSize = new Vector2(window.innerWidth, window.innerHeight);
    const scale = Math.min(windowSize.x / (size.x + 60), windowSize.y / (size.y + 60));
    const position = windowSize.sub(size.scale(scale)).div(2);
    this.animations[0][force ? "force" : "target"] = size.x;
    this.animations[1][force ? "force" : "target"] = size.y;
    this.animations[2][force ? "force" : "target"] = position.x + (left < 0 ? -left * scale : 0);
    this.animations[3][force ? "force" : "target"] = position.y + (top < 0 ? -top * scale : 0);
    this.animations[4][force ? "force" : "target"] = scale;
  }
};

// ts/classes/element/tile.ts
var Tile = class extends HTML {
  constructor(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    super({
      transform: options.transform
    });
    this._options = options;
    let repeatX, repeatY;
    if ("size" in options) {
      repeatX = Math.ceil(options.size.x / options.tileSize.x);
      repeatY = Math.ceil(options.size.y / options.tileSize.y);
      if (options.clip) {
        options.options.style.overflow = "hidden";
      }
    } else {
      repeatX = (_a = options.repeatX) != null ? _a : 1;
      repeatY = (_b = options.repeatY) != null ? _b : 1;
    }
    options.offsetRow = (_c = options.offsetRow) != null ? _c : new Vector2(0, 0);
    options.offsetCol = (_d = options.offsetCol) != null ? _d : new Vector2(0, 0);
    for (let i = 0; i < repeatX; i++) {
      for (let j = 0; j < repeatY; j++) {
        const o = new Vector2(
          i * options.tileSize.x + (i % 2 !== 0 ? options.offsetCol.x : 0) + (j % 2 !== 0 ? options.offsetRow.x : 0),
          j * options.tileSize.y + (j % 2 !== 0 ? options.offsetCol.y : 0) + (i % 2 !== 0 ? options.offsetRow.y : 0)
        );
        this.append(new HTML(__spreadValues(__spreadValues({}, options.options), {
          transform: __spreadProps(__spreadValues({}, (_e = options.options.transform) != null ? _e : {}), {
            position: (_h = (_g = (_f = options.options.transform) == null ? void 0 : _f.position) == null ? void 0 : _g.add(
              o
            )) != null ? _h : o
          })
        })));
      }
    }
  }
};

// ts/classes/util/section.ts
var Section = class extends HTML {
  constructor(style, gridData, name) {
    super({
      style: __spreadValues({
        overflow: "hidden",
        borderRadius: "10px"
      }, style),
      transform: {
        anchor: new Vector2(0, 0)
      }
    });
    this.gridData = {
      position: new Vector2(0, 0),
      size: new Vector2(0, 0),
      scale: new Vector2(1, 1),
      index: 0
    };
    this.absolute = true;
    this.gridData = __spreadValues({
      position: new Vector2(0, 0),
      size: new Vector2(0, 0),
      scale: new Vector2(1, 1),
      index: 0
    }, gridData);
    this.name = name;
    this.dom.classList.add("section-".concat(name));
    this.animations = glob.bulkAnimations([{
      scale: 1e3,
      duration: 350,
      onChange: (value) => {
        this.transform.setSize(new Vector2(value, this.transform.size.y));
      }
    }, {
      scale: 1e3,
      duration: 350,
      onChange: (value) => {
        this.transform.setSize(new Vector2(this.transform.size.x, value));
      }
    }, {
      scale: 1e3,
      duration: 350,
      onChange: (value) => {
        this.transform.setPosition(new Vector2(value, this.transform.position.y));
      }
    }, {
      scale: 1e3,
      duration: 350,
      onChange: (value) => {
        this.transform.setPosition(new Vector2(this.transform.position.x, value));
      }
    }, {
      scale: 10,
      duration: 350,
      onChange: (value) => {
        this.transform.setScale(new Vector2(value, this.transform.scale.y));
      }
    }, {
      scale: 10,
      duration: 350,
      onChange: (value) => {
        this.transform.setScale(new Vector2(this.transform.scale.x, value));
      }
    }]);
  }
  updateGrid() {
    var _a, _b;
    Object.assign(this.gridData, (_b = (_a = this.gridData).sizer) == null ? void 0 : _b.call(_a));
    this.animations[0].target = this.gridData.size.x;
    this.animations[1].target = this.gridData.size.y;
    this.animations[2].target = this.gridData.position.x;
    this.animations[3].target = this.gridData.position.y;
    this.animations[4].target = this.gridData.scale.x;
    this.animations[5].target = this.gridData.scale.y;
    this.dom.style.zIndex = this.gridData.index.toString();
  }
};

// ts/classes/element/flex.ts
var Flex = class extends HTML {
  constructor(options) {
    super(__spreadProps(__spreadValues({}, options), { classList: [...options.classList || [], "_flex"] }));
    this.setStyle({
      flexDirection: options.flexDirection,
      justifyContent: options.justifyContent,
      alignItems: options.alignItems,
      alignContent: options.alignContent,
      flexWrap: options.flexWrap,
      gap: "".concat(options.gap, "px")
    });
    this.setStyle(options.style || {});
  }
  set visible(visible) {
    this._visible = visible;
    this.dom.style.display = visible ? "flex" : "none";
  }
  get visible() {
    return this._visible;
  }
};

// ts/classes/util/icon.ts
var Icon = class extends HTML {
  constructor(text, size = 25, color = "white", solid = false) {
    super({
      text,
      classList: solid ? ["material-symbols-outlined", "solid"] : ["material-symbols-outlined"],
      style: {
        fontSize: size + "px",
        color,
        pointerEvents: "none",
        transition: "font-size 0.2s ease-in-out"
      }
    });
  }
  changeIcon(text) {
    this.setText(text);
  }
  iconSize(size) {
    this.dom.style.fontSize = size + "px";
  }
};

// ts/classes/sections/coffee/assets.ts
var CoffeeMachine = class extends HTML {
  constructor(position, onDrink) {
    super({
      style: {
        filter: "drop-shadow(3px -9px 20px #00000020)"
      },
      transform: {
        position,
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(270, 300)
      }
    });
    this._cup = false;
    this.filled = 0;
    this._filling = false;
    let c1 = false;
    let c2 = false;
    this.append(new Cup({
      position: new Vector2(105 - 55, 60 - 200),
      rotation: 0,
      scale: new Vector2(1, 1),
      onClick: (e, element) => this.click(element, void 0, () => c1 = true)
    }));
    this.append(new Cup({
      position: new Vector2(100 - 55, 130 - 200),
      rotation: 0,
      scale: new Vector2(1, -1),
      onClick: (e, element) => this.click(element, () => c1)
    }));
    this.append(new Cup({
      position: new Vector2(215 - 55, 70 - 200),
      rotation: -10,
      scale: new Vector2(1, 1),
      onClick: (e, element) => this.click(element, void 0, () => c2 = true)
    }));
    this.append(new Cup({
      position: new Vector2(215 - 55, 130 - 200),
      rotation: 0,
      scale: new Vector2(-1, 1),
      onClick: (e, element) => this.click(element, () => c2)
    }));
    this.append(new Cup({
      position: new Vector2(150 - 55, 130 - 200),
      rotation: 0,
      scale: new Vector2(-1, 1),
      onClick: (e, element) => this.click(element)
    }));
    this.append(new HTML({
      style: {
        backgroundColor: "#646464",
        borderRadius: "20px 20px 5px 5px"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(230, 250),
        rotation: 0,
        position: new Vector2(20, 20)
      }
    }));
    this.append(this.coffee1 = new HTML({
      style: {
        backgroundColor: "#00000088"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(10, 80),
        position: new Vector2(115, 100)
      }
    }));
    this.append(this.coffee2 = new HTML({
      style: {
        backgroundColor: "#00000088"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(10, 80),
        position: new Vector2(135, 100)
      }
    }));
    this.append(new HTML({
      style: {
        backgroundColor: "#e4e3e0",
        borderRadius: "0px 0px 10px 10px",
        filter: "drop-shadow(3px 4px 6px #00000040)",
        boxShadow: "inset 5px 0px 30px #00000040"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(10, 15),
        position: new Vector2(115, 135)
      }
    }));
    this.append(new HTML({
      style: {
        backgroundColor: "#e4e3e0",
        borderRadius: "0px 0px 10px 10px",
        filter: "drop-shadow(3px 4px 6px #00000040)",
        boxShadow: "inset 5px 0px 30px #00000040"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(10, 15),
        position: new Vector2(135, 135)
      }
    }));
    this.append(new HTML({
      style: {
        backgroundColor: "#e4e3e0",
        borderRadius: "0px 0px 10px 10px",
        filter: "drop-shadow(3px 4px 6px #00000040)",
        boxShadow: "inset 5px 0px 30px #00000040"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(60, 30),
        position: new Vector2(100, 110)
      }
    }));
    this.append(new HTML({
      style: {
        backgroundColor: "#504f5a",
        borderRadius: "10px 10px 30px 30px",
        filter: "drop-shadow(0px 4px 3px #00000040)"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(270, 110),
        rotation: 0,
        position: new Vector2(0, 0)
      }
    }));
    this.screen = this.append(new HTML({
      style: {
        backgroundColor: "rgb(34, 36, 50)",
        borderRadius: "7px",
        boxShadow: "inset 6px 3px 50px 3px #00000088"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(128, 50),
        rotation: 0,
        position: new Vector2(65, 40)
      },
      children: [
        new HTML({ transform: { size: new Vector2(18, 40), position: new Vector2(10 + 1 - 2, 5) }, style: { transition: "opacity 0.3s", backgroundColor: "#579557cc", borderRadius: "3px" } }),
        new HTML({ transform: { size: new Vector2(18, 40), position: new Vector2(32 + 2 - 2, 5) }, style: { transition: "opacity 0.3s", backgroundColor: "#579557cc", borderRadius: "3px" } }),
        new HTML({ transform: { size: new Vector2(18, 40), position: new Vector2(54 + 3 - 2, 5) }, style: { transition: "opacity 0.3s", backgroundColor: "#579557cc", borderRadius: "3px" } }),
        new HTML({ transform: { size: new Vector2(18, 40), position: new Vector2(76 + 4 - 2, 5) }, style: { transition: "opacity 0.3s", backgroundColor: "#579557cc", borderRadius: "3px" } }),
        new HTML({ transform: { size: new Vector2(18, 40), position: new Vector2(98 + 5 - 2, 5) }, style: { transition: "opacity 0.3s", backgroundColor: "#579557cc", borderRadius: "3px" } })
      ]
    }));
    this.append(new Flex({
      justifyContent: "center",
      alignItems: "center",
      style: {
        backgroundColor: "rgb(179 211 218)",
        borderRadius: "100%",
        boxShadow: " inset 1px 1px 4px #000000cc",
        border: "2px solid #d7d6d3",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease-in-out"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(40, 40),
        rotation: 0,
        position: new Vector2(205, 20)
      },
      onMouseDown: (e, element) => {
        element.dom.style.boxShadow = "inset 1px 1px 8px #000000aa";
        element.children[0].iconSize(25);
        if (this.cup) {
          this.filling = true;
        }
      },
      onMouseUp: (e, element) => {
        element.dom.style.boxShadow = "inset 1px 1px 4px #000000cc";
        element.children[0].iconSize(26);
      },
      children: [
        new Icon("coffee", 26, "black", true)
      ]
    }));
    this.append(this.cupAsset = new Cup({
      position: new Vector2(90, 180),
      rotation: 0,
      scale: new Vector2(1, 1),
      onClick: () => {
        if (this.filled >= 1) {
          this.filled = 0;
          this.filling = false;
          this.cup = false;
          onDrink();
        }
      }
    }));
    this.append(new HTML({
      style: {
        backgroundColor: "#504f5a",
        borderRadius: "20px 20px 5px 5px",
        filter: "drop-shadow(0px -4px 3px #00000040)"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(270, 50),
        rotation: 0,
        position: new Vector2(0, 250)
      }
    }));
    this.filling = false;
    this.cup = false;
  }
  get cup() {
    return this._cup;
  }
  set cup(value) {
    this._cup = value;
    this.cupAsset.visible = value;
    this.cupAsset.steaming = false;
  }
  click(element, validation, add) {
    if (!this.cup && (!validation || validation())) {
      this.cup = true;
      element.visible = false;
      add == null ? void 0 : add();
    }
  }
  get filling() {
    return this._filling;
  }
  set filling(value) {
    this.coffee1.visible = value;
    this.coffee2.visible = value;
    this._filling = value;
  }
  tick(obj) {
    super.tick(obj);
    if (this.filling) {
      this.filled += obj.interval * 1e-4;
      if (this.filled > 1) {
        this.filling = false;
      }
      if (this.filled > 0.7) {
        this.cupAsset.steaming = true;
      }
    }
    this.screen.children.forEach((c, i) => {
      c.dom.style.opacity = this.filled > i * 0.2 + 0.1 ? "1" : "0.1";
    });
  }
};
var Cup = class extends HTML {
  constructor({ position = new Vector2(0, 0), rotation = 0, scale = new Vector2(1, 1), onClick } = {}) {
    super({
      style: {
        filter: "drop-shadow(3px 4px 6px #00000080)",
        cursor: "pointer"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(80, 70),
        position,
        rotation
      },
      onMouseDown: onClick
    });
    this.steam = [];
    this._steaming = false;
    this.steam.push(this.append(new HTML({
      style: {
        backgroundColor: "#4c201840",
        filter: "blur(3px)",
        borderRadius: "20px",
        pointerEvents: "none",
        transition: "opacity 1s ease-in-out"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(10, 200),
        position: new Vector2(15, -100)
      }
    })));
    this.steam.push(this.append(new HTML({
      style: {
        backgroundColor: "#4c201840",
        filter: "blur(3px)",
        borderRadius: "20px",
        pointerEvents: "none",
        transition: "opacity 1s ease-in-out"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(15, 200),
        position: new Vector2(35, -110)
      }
    })));
    this.steam.push(this.append(new HTML({
      style: {
        backgroundColor: "#4c201840",
        filter: "blur(3px)",
        borderRadius: "20px",
        pointerEvents: "none",
        transition: "opacity 1s ease-in-out"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(10, 200),
        position: new Vector2(55, -90)
      }
    })));
    this.steam.push(this.append(new HTML({
      style: {
        backgroundColor: "#4c201820",
        filter: "blur(3px)",
        borderRadius: "20px",
        pointerEvents: "none",
        transition: "opacity 1s ease-in-out"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(25, 80),
        position: new Vector2(30, -55)
      }
    })));
    const mug = this.append(new HTML({
      style: {
        backgroundColor: "#e4e3e0",
        borderRadius: "2px 2px 20px 20px",
        boxShadow: "inset 10px 0px 40px #00000040"
      },
      transform: {
        size: new Vector2(80, 70),
        anchor: new Vector2(0.5, 0.5),
        scale
      }
    }));
    mug.append(new HTML({
      style: {
        borderRadius: "20px 0px 0px 20px",
        border: "10px solid #e4e3e0",
        boxSizing: "border-box",
        borderRight: "none"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(25, 40),
        position: new Vector2(-25, 0)
      }
    }));
    this.steaming = false;
  }
  set steaming(value) {
    this.steam.forEach((s) => {
      s.dom.style.opacity = value ? "1" : "0";
    });
    this._steaming = value;
  }
  get steaming() {
    return this._steaming;
  }
  tick(obj) {
    super.tick(obj);
    if (this.steaming) {
      this.steam.forEach((s, i) => {
        s.dom.style.left = Math.sin(obj.total * 5e-4 * (0.6 + (i + 1))) * 8 + "px";
      });
    }
  }
};

// ts/classes/sections/coffee/coffee.ts
var Coffee = class extends Section {
  constructor(parent) {
    super({
      backgroundColor: "#354c59",
      justifyContent: "flex-start",
      overflow: "hidden",
      boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)"
    }, {
      size: new Vector2(0, 600),
      position: new Vector2(720, 0),
      scale: new Vector2(1, 1),
      index: 0,
      sizer: () => {
        return {
          size: new Vector2(parent.getState("atcoffeemachine") ? 400 : 0, 600),
          position: new Vector2(680, 200),
          scale: new Vector2(0.75, 0.75),
          index: 0
        };
      }
    }, "coffee");
    this.parent = parent;
    this.append(new Tile({
      tileSize: new Vector2(80, 120),
      transform: {
        position: new Vector2(0, -200),
        rotation: 30
      },
      offsetRow: new Vector2(0, 0),
      offsetCol: new Vector2(0, 0),
      repeatX: 1,
      repeatY: 5,
      options: {
        style: {
          width: "800px",
          height: "80px",
          border: "10px solid rgb(60, 85, 97)",
          boxSizing: "border-box",
          backgroundColor: "#3c5561",
          borderRadius: "20px"
        },
        transform: {}
      }
    }));
    const table = this.append(new HTML({
      style: {
        backgroundColor: "#674b47",
        filter: "drop-shadow(0px -4px 30px #00000040)",
        padding: "30px solid #674b47",
        boxSizing: "border-box"
      },
      transform: {
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(500, 110),
        rotation: 0,
        position: new Vector2(-50, 500)
      }
    }));
    table.append(new Tile({
      tileSize: new Vector2(45, 120),
      transform: {
        position: new Vector2(-15, 15)
      },
      offsetRow: new Vector2(0, 0),
      offsetCol: new Vector2(0, 0),
      repeatX: 20,
      repeatY: 1,
      options: {
        style: {
          width: "35px",
          height: "110px",
          boxSizing: "border-box",
          backgroundColor: "#79514b"
        },
        transform: {}
      }
    }));
    this.append(new CoffeeMachine(new Vector2(55, 240), () => {
      this.parent.office.tired = 0;
    }));
  }
};

// ts/classes/math/easings.ts
var Ease = {
  // No easing, no acceleration
  linear: (t) => t,
  // Accelerates fast, then slows quickly towards end.
  quadratic: (t) => t * (-(t * t) * t + 4 * t * t - 6 * t + 4),
  // Overshoots over 1 and then returns to 1 towards end.
  cubic: (t) => t * (4 * t * t - 9 * t + 6),
  // Overshoots over 1 multiple times - wiggles around 1.
  elastic: (t) => t * (33 * t * t * t * t - 106 * t * t * t + 126 * t * t - 67 * t + 15),
  // Accelerating from zero velocity
  inQuad: (t) => t * t,
  // Decelerating to zero velocity
  outQuad: (t) => t * (2 - t),
  // Acceleration until halfway, then deceleration
  inOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  // Accelerating from zero velocity
  inCubic: (t) => t * t * t,
  // Decelerating to zero velocity
  outCubic: (t) => --t * t * t + 1,
  // Acceleration until halfway, then deceleration
  inOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // Accelerating from zero velocity
  inQuart: (t) => t * t * t * t,
  // Decelerating to zero velocity
  outQuart: (t) => 1 - --t * t * t * t,
  // Acceleration until halfway, then deceleration
  inOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // Accelerating from zero velocity
  inQuint: (t) => t * t * t * t * t,
  // Decelerating to zero velocity
  outQuint: (t) => 1 + --t * t * t * t * t,
  // Acceleration until halfway, then deceleration
  inOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  // Accelerating from zero velocity
  inSine: (t) => -Math.cos(t * (Math.PI / 2)) + 1,
  // Decelerating to zero velocity
  outSine: (t) => Math.sin(t * (Math.PI / 2)),
  // Accelerating until halfway, then decelerating
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  // Exponential accelerating from zero velocity
  inExpo: (t) => Math.pow(2, 10 * (t - 1)),
  // Exponential decelerating to zero velocity
  outExpo: (t) => -Math.pow(2, -10 * t) + 1,
  // Exponential accelerating until halfway, then decelerating
  inOutExpo: (t) => {
    t /= 0.5;
    if (t < 1)
      return Math.pow(2, 10 * (t - 1)) / 2;
    t--;
    return (-Math.pow(2, -10 * t) + 2) / 2;
  },
  // Circular accelerating from zero velocity
  inCirc: (t) => -Math.sqrt(1 - t * t) + 1,
  // Circular decelerating to zero velocity Moves VERY fast at the beginning and
  // then quickly slows down in the middle. This tween can actually be used
  // in continuous transitions where target value changes all the time,
  // because of the very quick start, it hides the jitter between target value changes.
  outCirc: (t) => Math.sqrt(1 - (t = t - 1) * t),
  // Circular acceleration until halfway, then deceleration
  inOutCirc: (t) => {
    t /= 0.5;
    if (t < 1)
      return -(Math.sqrt(1 - t * t) - 1) / 2;
    t -= 2;
    return (Math.sqrt(1 - t * t) + 1) / 2;
  }
};

// ts/classes/sections/computer/computer.ts
var Computer = class extends Section {
  constructor(parent) {
    super({
      backgroundColor: "#90857f",
      width: "100%",
      height: "350px",
      justifyContent: "flex-start",
      overflow: "hidden"
    }, {
      size: new Vector2(450, 0),
      position: new Vector2(0, 0),
      scale: new Vector2(0.75, 0.75),
      index: 0,
      sizer: () => {
        return {
          size: new Vector2(450, parent.getState("atdesk") ? 350 : 0),
          position: new Vector2(50, parent.getState("atdesk") ? -230 : 0),
          index: 2
        };
      }
    }, "computer");
    this.parent = parent;
    this._text = "";
    this._code = void 0;
    this._completed = 2;
    this.target = 3;
    this.screen = this.append(new HTML({
      style: {
        width: "440px",
        height: "330px",
        backgroundColor: "#222432",
        boxShadow: "inset rgb(0 0 0) 6px 3px 200px 3px",
        borderRadius: "30px",
        overflow: "hidden",
        cursor: "none",
        bottom: "10px",
        left: "5px"
      },
      onMouseEnter: () => {
        this.cursor.visible = true;
      },
      onMouseMove: (e) => {
        this.cursor.transform.setPosition(new Vector2(e.offsetX, e.offsetY));
        this.sitter.person.armTwist = [0.5, 2];
      },
      onMouseLeave: () => {
        this.sitter.person.armTwist = [0.5, -0.5];
        this.cursor.visible = false;
      }
    }));
    this.textElement = this.screen.append(new Flex({
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      style: {
        width: "100%",
        height: "60%",
        fontSize: "100px",
        color: "#fff",
        fontWeight: "bold",
        lineHeight: "90px",
        fontFamily: "monospace",
        borderRadius: "30px",
        pointerEvents: "none",
        filter: "sepia(0.6) blur(0.5px)",
        letterSpacing: "4px",
        textAlign: "center",
        marginTop: "20%"
      }
    }));
    this.textElement2 = this.screen.append(new Flex({
      flexDirection: "column",
      text: "completed",
      alignItems: "center",
      justifyContent: "center",
      style: {
        width: "100%",
        height: "40%",
        fontSize: "40px",
        color: "#fff",
        fontWeight: "bold",
        lineHeight: "90px",
        fontFamily: "monospace",
        borderRadius: "30px",
        pointerEvents: "none",
        filter: "sepia(0.6) blur(0.5px)",
        letterSpacing: "4px",
        textAlign: "center"
      }
    }));
    this.cursor = this.screen.append(new HTML({
      style: {
        width: "16px",
        height: "40px",
        backgroundColor: "#fff",
        outline: "1px solid black",
        filter: "drop-shadow(3px 6px 6px #000000ff) blur(3px)",
        pointerEvents: "none"
      },
      transform: {
        position: new Vector2(30, 40),
        scale: new Vector2(0.3, 0.3),
        rotation: -20
      }
    }));
    this.cursor.append(new HTML({
      style: {
        width: "60px",
        height: "80px",
        backgroundColor: "#fff",
        //triangle
        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"
      },
      transform: {
        position: new Vector2(-22, -70)
      }
    }));
    this.scanline = this.screen.append(new HTML({
      style: {
        width: "100%",
        height: "90px",
        backgroundColor: "#22243212",
        filter: "drop-shadow(0px 0px 10px #ffffff40)  blur(2px)",
        pointerEvents: "none"
      }
    }));
    this.cursor.visible = false;
    this.setCode("012");
    this.setTT("");
    this.completed = 2;
  }
  get sitter() {
    return this.parent.office.sitter;
  }
  setCode(code) {
    this._code = code;
  }
  set completed(value) {
    this.textElement2.setText(value.toString().padStart(2, "0") + "/" + this.target.toString().padStart(2, "0"));
    this._completed = value;
  }
  get completed() {
    return this._completed;
  }
  setTT(text) {
    var _a;
    if (!this._code)
      return;
    if (text.length > this._code.length)
      return;
    this._text = text;
    this.textElement.setText(text.replaceAll("0", "#").replaceAll("1", "$").replaceAll("2", "&").replaceAll("3", "!").replaceAll("4", "@").replaceAll("5", "=").padEnd(((_a = this._code) == null ? void 0 : _a.length) || 4, "_"));
    if (this._text.indexOf("_") === -1) {
      if (this._text.substring(0, this._code.length) === this._code) {
        this.screen.setStyle({
          backgroundColor: "#456c44"
        });
        this.setCode(void 0);
        this.completed++;
        setTimeout(() => {
          const code = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6).toString()).join("");
          this.setCode(code);
          this.setTT("_____");
        }, 1e3);
      } else {
        this.screen.setStyle({
          backgroundColor: "#6c4444"
        });
        setTimeout(() => {
          let NC = "";
          for (let i = 0; i < this._code.length; i++) {
            if (this._code[i] === this._text[i]) {
              NC += this._code[i];
            } else {
              NC += "_";
            }
          }
          this.setTT(NC);
        }, 400);
      }
    } else {
      this.screen.setStyle({
        backgroundColor: "#222432"
      });
    }
  }
  addTT(text) {
    const index = this._text.indexOf("_");
    if (index === -1)
      return;
    this.setTT(this._text.substring(0, index) + text + this._text.substring(index + 1));
  }
  tick(obj) {
    super.tick(obj);
    this.scanline.transform.setPosition(new Vector2(0, obj.total % 4e3 / 4e3 * 700 - 100));
    let t = (this.parent.office.tired - 0.5) * 2;
    if (t > 0.25) {
      this.setStyle({
        filter: "blur(".concat(Ease.inOutCubic(Math.sin(obj.total * 1e-4 + 0.2) * Math.sin(obj.total * 1e-3 + 0.2) * t) * 4, "px)")
      });
    } else {
      this.setStyle({
        filter: "blur(0px)"
      });
    }
  }
};

// ts/classes/sections/debug.ts
var Debug = class extends Section {
  constructor(parent) {
    super({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "10px",
      boxSizing: "border-box",
      backgroundColor: "transparent",
      boxShadow: "none",
      overflow: "visible",
      pointerEvents: "none",
      background: "#3c5561",
      color: "#fff",
      fontFamily: "monospace",
      fontSize: "24px",
      padding: "0 10px"
    }, {
      size: new Vector2(0, 0),
      position: new Vector2(-50, -50),
      index: 0
    }, "debug");
    this.parent = parent;
  }
};

// ts/classes/sections/gameover.ts
var Gameover = class extends Section {
  constructor(parent) {
    super({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "10px",
      boxSizing: "border-box",
      backgroundColor: "transparent",
      boxShadow: "none",
      pointerEvents: "none",
      background: "#3c5561",
      width: "100%",
      height: "100%",
      padding: "50px",
      overflow: "hidden"
    }, {
      size: new Vector2(700, 600),
      position: new Vector2(470, 0),
      index: 2,
      sizer: () => {
        return {
          size: new Vector2(700, 600),
          position: new Vector2(0, 0),
          index: parent.getState("gameover") ? 2 : -1
        };
      }
    }, "gameover");
    this.parent = parent;
    this.append(this.text1 = new HTML({
      style: {
        width: "100%",
        fontFamily: "Noto Sans",
        fontWeight: "500",
        textShadow: "0px 0px 10px black",
        lineHeight: "100px",
        fontSize: "85px",
        color: "#fff",
        position: "relative"
      },
      text: "GAME OVER"
    }));
    this.append(this.text2 = new HTML({
      style: {
        width: "100%",
        fontFamily: "Noto Sans",
        fontWeight: "500",
        textShadow: "0px 0px 10px black",
        fontSize: "40px",
        color: "#fff",
        position: "relative",
        lineHeight: "50px",
        marginLeft: "20px"
      }
    }));
    this.append(this.button = new HTML({
      style: {
        width: "100%",
        fontFamily: "Noto Sans",
        fontWeight: "500",
        textShadow: "0px 0px 10px black",
        fontSize: "20px",
        color: "rgb(209 208 255)",
        position: "relative",
        lineHeight: "30px",
        pointerEvents: "none",
        marginLeft: "20px",
        cursor: "pointer"
      },
      text: "Retry?",
      onMouseDown: (e, element) => {
        window.location.reload();
      }
    }));
    this.opacity = 0;
    this.text1.setText("GAME OVER");
  }
  trigger() {
    this.opacity = 0.8;
    glob.game.ticker.mode = "animations";
    this.parent.addState("atdesk", false);
    this.parent.addState("atcoffeemachine", false);
    this.text2.setText("".concat(this.parent.office.npc.collected, " report").concat(this.parent.office.npc.collected === 1 ? "" : "s", " completed"));
    this.button.dom.style.pointerEvents = "auto";
  }
  tick(obj) {
    if (this.parent.getState("gameover")) {
      this.trigger();
    }
  }
};

// ts/classes/element/button.ts
var Button = class extends HTML {
  constructor(options) {
    super(__spreadProps(__spreadValues({}, options), { classList: [...options.classList || [], "_button"] }));
    this.setText(this.options.text);
  }
};

// ts/classes/sections/keyboard/asset.ts
function getBigKeyboard(position, rotation, onMouseDown, onMouseUp) {
  const wrap = new HTML({
    style: {
      width: "450px",
      height: "240px",
      backgroundColor: "#a69d97",
      borderRadius: "10px",
      boxShadow: "1px 1.8px 0px #00000040",
      filter: "drop-shadow(3px 4px 2px #00000020)"
    },
    transform: {
      position,
      rotation,
      anchor: new Vector2(0.5, 0.5)
    }
  });
  const buttons = [];
  for (let i = 0; i < 6; i++) {
    let e;
    const b = new Button({
      style: {
        width: "94px",
        height: "94px",
        backgroundColor: "#a59c96",
        borderRadius: "7px",
        boxShadow: "6px 6px 2px #00000030, inset 28px 28px 28px #00000020",
        cursor: "pointer",
        padding: "0px",
        border: "none",
        transition: "box-shadow 0.04s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "80px",
        fontWeight: "bold",
        color: "#776b6bcc",
        fontFamily: "monospace"
      },
      text: ["#", "$", "&", "!", "@", "="][i],
      onMouseDown: () => {
        b.dom.style.boxShadow = "3px 3px 0px #00000040, inset 28px 28px 28px #00000020";
        onMouseDown(i);
      },
      onMouseUp: () => {
        b.dom.style.boxShadow = "6px 6px 2px #00000030, inset 28px 28px 28px #00000020";
        onMouseUp();
      },
      onMouseLeave: () => {
        b.dom.style.boxShadow = "6px 6px 2px #00000030, inset 28px 28px 28px #00000020";
        onMouseUp();
      },
      transform: {
        position: new Vector2(
          50 + i % 3 * (18 * 7),
          10 + Math.floor(i / 3) * 110
        ),
        anchor: new Vector2(0.5, 0.5)
      }
    });
    wrap.append(buttons[i] = b);
  }
  return wrap;
}

// ts/classes/sections/keyboard/keyboard.ts
var Keyboard = class extends Section {
  constructor(parent) {
    super({
      width: "100%",
      height: "100%",
      justifyContent: "flex-start",
      overflow: "hidden"
    }, {
      size: new Vector2(450, 230),
      position: new Vector2(0, 370),
      scale: new Vector2(0.5, 0.5),
      index: 2,
      sizer: () => {
        return {
          size: new Vector2(450, parent.getState("atdesk") ? 240 : 0),
          position: new Vector2(370, parent.getState("atdesk") ? -140 : -0),
          index: 2
        };
      }
    }, "keyboard");
    this.parent = parent;
    this.append(getBigKeyboard(new Vector2(0, 0), 0, (key) => {
      this.computer.addTT(key.toString());
      if (key === 0 || key === 3) {
        this.sitter.person.armTwist = [0.2, -0.5];
      } else if (key === 1 || key === 4) {
        this.sitter.person.armTwist = [1, -0.5];
      } else if (key === 2 || key === 5) {
        this.sitter.person.armTwist = [0.5, -0.8];
      }
    }, () => {
      this.sitter.person.armTwist = [0.5, -0.5];
    }));
    this.children[0].dom.style.bottom = "0px";
  }
  get sitter() {
    return this.parent.office.sitter;
  }
  get computer() {
    return this.parent.computer;
  }
  tick(obj) {
    super.tick(obj);
    let t = (this.parent.office.tired - 0.5) * 2;
    if (t > 0.25) {
      this.setStyle({
        filter: "blur(".concat(Ease.inOutCubic(Math.sin(obj.total * 1e-4 + 0.2) * Math.sin(obj.total * 1e-3 + 0.2) * t) * 4, "px)")
      });
    } else {
      this.setStyle({
        filter: "blur(0px)"
      });
    }
  }
};

// ts/classes/math/util.ts
var Utils = class {
  static clamp(value, min, max) {
    if (typeof value === "number" && typeof min === "number" && typeof max === "number") {
      return Math.max(min, Math.min(value, max));
    } else if (value instanceof Vector2 && min instanceof Vector2 && max instanceof Vector2) {
      return new Vector2(Math.max(min.x, Math.min(value.x, max.x)), Math.max(min.y, Math.min(value.y, max.y)));
    }
  }
  static lerp(a, b, t) {
    return a + (b - a) * t;
  }
  static isMobile() {
    return glob.mobile;
  }
  static mod(n, d) {
    return (n % d + d) % d;
  }
};

// ts/classes/sections/office/clutter.ts
function getPaper(position, rotation = 0, corner = false) {
  return new HTML({
    style: {
      width: "26px",
      height: "43px",
      backgroundColor: "#d0cdcd",
      filter: "drop-shadow(0px 0px 2px #0000004a)",
      borderRadius: corner ? "6px 0 0 0" : "0px"
    },
    transform: {
      position,
      rotation,
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(26, 43)
    }
  });
}

// ts/classes/sections/office/prop.ts
function getPlant(position, rotation = 0, leaves = 11, angle = 66) {
  const plant = new HTML({
    style: {
      width: "75px",
      height: "75px",
      backgroundColor: "#726553",
      borderRadius: "50%",
      boxShadow: "inset 0px 0px 11px #2f2828, 3px 1px 4px #00000054"
    },
    transform: {
      position,
      rotation,
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(75, 75)
    }
  });
  for (let i = 0; i < leaves; i++) {
    plant.append(getLeaf(new Vector2(40, 8), i * angle));
    const p = getLeaf(new Vector2(40, 8), i * angle);
    p.transform.setScale(new Vector2(p.transform.scale.x * 0.85, p.transform.scale.y * 0.8));
    plant.append(p);
  }
  return plant;
}
function getLeaf(position, rotation = 0) {
  const wrap = new HTML({
    style: {
      width: "60px",
      height: "60px",
      filter: "drop-shadow(0px 0px 6px rgba(9, 48, 15, 0.9))"
    },
    transform: {
      position,
      rotation,
      scale: new Vector2(0.6 + Math.random() * 0.1, 0.25 + Math.random() * 0.1),
      anchor: new Vector2(0, 0.5),
      size: new Vector2(60, 60)
    }
  });
  wrap.append(new HTML({
    style: {
      width: "60px",
      height: "60px",
      borderRadius: "50% 50% 50% 4px",
      backgroundColor: "#3c8b49",
      boxShadow: "inset 4px 4px 20px #295629"
    },
    transform: {
      rotation: 45,
      anchor: new Vector2(0.5, 0.9),
      size: new Vector2(60, 60)
    }
  }));
  return wrap;
}
function getCoffeeMachine(position, rotation = 0, leaves = 11, angle = 66) {
  const table = new HTML({
    style: {
      width: "75px",
      height: "90px",
      backgroundColor: "#674b47",
      borderRadius: "5px",
      border: "10px solid #664a46",
      boxSizing: "border-box",
      boxShadow: "inset 0px 0px 20px #79514b, 3px 1px 4px #00000054"
    },
    transform: {
      position,
      rotation,
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(75, 75)
    }
  });
  table.append(new HTML({
    style: {
      width: "50px",
      height: "40px",
      backgroundColor: "#504f5a",
      borderRadius: "5px",
      boxShadow: "inset 0px 0px 11px #2f2828, 3px 1px 4px #00000054"
    },
    transform: {
      position: new Vector2(0, 8),
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(50, 40)
    }
  }));
  table.append(getTopCup(new Vector2(27, 15), 14));
  table.append(getTopCup(new Vector2(27, 17), -10));
  table.append(getTopCup(new Vector2(30, 30), 180));
  table.append(getTopCup(new Vector2(30, 30), 4));
  table.append(getTopCup(new Vector2(16, 25), 170));
  return table;
}
function getTopCup(position, rotation) {
  const wrap = new HTML({
    style: {
      width: "12px",
      height: "12px",
      backgroundColor: "#e4e3e0",
      borderRadius: "100%",
      boxSizing: "border-box",
      border: "2px solid #e4e3e0",
      boxShadow: "inset 4px 0px 2px #00000020, 0px 0px 2px #00000090"
    },
    transform: {
      position,
      rotation,
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(12, 12)
    }
  });
  wrap.append(new HTML({
    style: {
      width: "4px",
      height: "4px",
      backgroundColor: "#e4e3e0",
      borderRadius: "1px",
      boxShadow: "inset 10px 0px 4px #00000030, 0px 0px 1px #00000090",
      zIndex: "-1"
    },
    transform: {
      position: new Vector2(5, -3),
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(10, 2)
    }
  }));
  return wrap;
}
function getPhone(position, rotation) {
  const wrap = new HTML({
    style: {
      width: "40px",
      height: "45px",
      backgroundColor: "#a69d97",
      borderRadius: "4px",
      filter: "drop-shadow(3px 4px 2px #00000040)"
    },
    transform: {
      position,
      rotation,
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(40, 45)
    }
  });
  wrap.append(new HTML({
    style: {
      width: "15px",
      height: "40px",
      backgroundColor: "#90857f",
      borderRadius: "4px",
      filter: "drop-shadow(2px 1px 1px #00000040)"
    },
    transform: {
      position: new Vector2(2, 2),
      size: new Vector2(15, 40)
    }
  }));
  return wrap;
}
function getKeyboard(position, rotation) {
  const wrap = new HTML({
    style: {
      width: "60px",
      height: "20px",
      backgroundColor: "#a69d97",
      borderRadius: "2px",
      boxShadow: "1px 1.8px 0px #00000040",
      filter: "drop-shadow(3px 4px 2px #00000020)"
    },
    transform: {
      position,
      rotation,
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(60, 20)
    }
  });
  wrap.append(new HTML({
    style: {
      width: "15px",
      height: "20px",
      backgroundColor: "#a69d97",
      borderRadius: "100%",
      boxShadow: "1px 1px 2px #00000040"
    },
    transform: {
      position: new Vector2(72, 4),
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(15, 20)
    }
  }));
  return wrap;
}
function getScreen(position, rotation) {
  const wrap = new HTML({
    style: {
      width: "70px",
      height: "60px",
      filter: "drop-shadow(3px 4px 5px #00000040)"
    },
    transform: {
      position,
      rotation,
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(70, 60)
    }
  });
  wrap.append(new HTML({
    style: {
      width: "30px",
      height: "50px",
      backgroundColor: "#a69d97",
      borderRadius: "10px"
    },
    transform: {
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(30, 50),
      rotation: 30,
      position: new Vector2(8, 11)
    }
  }));
  wrap.append(new HTML({
    style: {
      width: "30px",
      height: "50px",
      backgroundColor: "#a69d97",
      borderRadius: "10px"
    },
    transform: {
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(30, 50),
      rotation: -30,
      position: new Vector2(32, 11)
    }
  }));
  wrap.append(new HTML({
    style: {
      width: "40px",
      height: "50px",
      backgroundColor: "#a69d97",
      borderRadius: "6px"
    },
    transform: {
      anchor: new Vector2(0.5, 0.5),
      size: new Vector2(40, 50),
      position: new Vector2(15, 5)
    }
  }));
  wrap.append(new HTML({
    style: {
      width: "70px",
      height: "20px",
      marginTop: "50px",
      backgroundColor: "#90857f",
      borderRadius: " 0 0 10px 10px  "
    },
    transform: {
      size: new Vector2(70, 20)
    }
  }));
  return wrap;
}

// ts/classes/sections/office/furniture.ts
function getDesk(position, rotation, screens = 1, style = {}) {
  const desk = new HTML({
    style: __spreadValues({
      width: "300px",
      height: "120px",
      backgroundColor: "#904639",
      filter: "drop-shadow(rgba(0, 0, 0, 0.3) 0px 0px 9px)",
      borderRadius: "10px"
    }, style),
    transform: {
      position,
      rotation,
      size: new Vector2(300, 120),
      anchor: new Vector2(0.5, 0.5)
    }
  });
  if (screens === 2) {
    desk.append(getScreen(new Vector2(55, -8), -8));
    desk.append(getScreen(new Vector2(135, -8), 8));
  } else {
    desk.append(getScreen(new Vector2(100, -8), 1));
  }
  desk.append(getKeyboard(new Vector2(105, 85), 0));
  if (Math.random() > 0.5)
    desk.append(getPaper(new Vector2(10, 30), 8, Math.random() > 0.3));
  if (Math.random() > 0.5)
    desk.append(getPaper(new Vector2(60, 70), 80, Math.random() > 0.3));
  if (Math.random() > 0.5)
    desk.append(getPaper(new Vector2(230, 40), -4, Math.random() > 0.3));
  if (Math.random() > 0.5)
    desk.append(getPaper(new Vector2(260, 38), 5, Math.random() > 0.3));
  desk.append(getPhone(new Vector2(220, 20), 4));
  return desk;
}
var Chair = class extends HTML {
  setRotation(rotation) {
    this.animations[0].target = rotation / 360;
  }
  setPosition(position) {
    this.animations[1].target = position.x;
    this.animations[2].target = position.y;
  }
  getPosition() {
    return this.seat.transform.absolute;
  }
  getRotation() {
    return this.animations[0].value * 360;
  }
  constructor(position, rotation, style = {}) {
    super({
      style: __spreadValues({
        width: "80px",
        height: "80px"
      }, style),
      transform: {
        position,
        rotation,
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(80, 80)
      }
    });
    this.animations = glob.bulkAnimations([{
      duration: 300,
      mode: "wrap",
      onChange: (value) => {
        this.seat.transform.setRotation(value * 360);
      }
    }, {
      scale: 1e3,
      duration: 300,
      onChange: (value) => {
        this.transform.setPosition(new Vector2(value, this.transform.position.y));
      }
    }, {
      scale: 1e3,
      duration: 300,
      onChange: (value) => {
        this.transform.setPosition(new Vector2(this.transform.position.x, value));
      }
    }]);
    for (let i = 0; i < 5; i++) {
      this.append(new HTML({
        style: {
          width: "70px",
          height: "10px",
          backgroundColor: "#c4aeae",
          filter: "drop-shadow(3px 4px 2px #00000030)",
          borderRadius: "10px"
        },
        transform: {
          position: new Vector2(40, 30),
          rotation: rotation + 20 + i * (360 / 5),
          anchor: new Vector2(0, 0.5),
          size: new Vector2(70, 10)
        }
      }));
    }
    this.seat = this.append(new HTML({
      style: {
        width: "70px",
        height: "80px",
        backgroundColor: "#646464",
        filter: "drop-shadow(3px 4px 5px #00000040)",
        borderRadius: "10px"
      },
      transform: {
        position: new Vector2(5, 0),
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(70, 80)
      }
    }));
    this.seat.append(new HTML({
      style: {
        width: "80px",
        height: "25px",
        backgroundColor: "#3c3c3c",
        borderRadius: "10px 10px 5px 5px",
        marginTop: "55px"
      },
      transform: {
        position: new Vector2(-5, 0),
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(80, 25)
      }
    }));
  }
};

// ts/classes/util/movement.ts
var Movement = class {
  constructor(actor, key, cycle, callback, state = 0) {
    this.actor = actor;
    this.key = key;
    this.cycle = cycle;
    this.callback = callback;
    this.state = "walking";
    this.index = 0;
    this.condition = void 0;
    this.index = state;
  }
  tick(obj) {
    const cycle = this.cycle[this.index];
    if (this.state === "walking") {
      this.move(cycle, obj);
    }
    if (this.state === "waiting") {
      this.wait(cycle);
    }
  }
  wait(cycle) {
    if (this.condition) {
      if (this.condition()) {
        this.condition = void 0;
        this.next();
      }
      this.callback(0, new Vector2(0, 0), "waiting", this.index);
    } else {
      this.callback(0, new Vector2(0, 0), "waiting", this.index);
    }
  }
  move(cycle, obj) {
    const velocity = cycle.to.sub(this.actor.transform.position).normalize().scale(cycle.speed);
    this.actor.move(obj, velocity, cycle.speed);
    this.callback(cycle.speed, velocity, "walking", this.index);
    if (this.actor.transform.position.distance(cycle.to) < 1) {
      this.state = "waiting";
      if (typeof cycle.condition === "function") {
        if (cycle.condition()) {
          this.next();
        } else {
          this.condition = cycle.condition;
        }
      } else {
        if (cycle.condition < 1) {
          this.next();
        } else {
          glob.timer.add("".concat(this.key, "-walk"), cycle.condition, () => {
            this.next();
          });
        }
      }
    }
  }
  next() {
    this.index++;
    if (this.index >= this.cycle.length) {
      this.index = 0;
    }
    this.state = "walking";
  }
};

// ts/classes/sections/office/people/assets.ts
var Person = class extends HTML {
  constructor(hair = "full") {
    super({
      style: {
        width: "80px",
        height: "30px"
      },
      transform: {
        size: new Vector2(80, 30),
        position: new Vector2(-40, -15),
        anchor: new Vector2(0.5, 0.5)
      }
    });
    this.arms = [];
    this.legs = [];
    this._legPosition = [1, 1];
    this._armPosition = [1, 1];
    this._armTwist = [0, 0];
    for (let i = 0; i < 2; i++) {
      const leg = this.append(new HTML({
        style: {
          width: "25px",
          height: "40px",
          backgroundColor: "#62698e",
          borderRadius: "20%"
        },
        transform: {
          position: new Vector2(i * 30 + 10, -25),
          anchor: new Vector2(0.5, 1),
          size: new Vector2(25, 40)
        }
      }));
      this.legs.push(leg);
    }
    this.torso = this.append(new HTML({
      style: {
        width: "80px",
        height: "30px",
        backgroundColor: "#a69d97",
        borderRadius: "20px",
        filter: "drop-shadow(3px 4px 3px #00000040)"
      },
      transform: {
        position: new Vector2(0, 0),
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(80, 30)
      }
    }));
    for (let i = 0; i < 2; i++) {
      const arm = this.torso.append(new HTML({
        style: {
          width: "20px",
          height: "60px",
          backgroundColor: "#a69d97",
          borderRadius: "20%",
          filter: "drop-shadow(3px 4px 5px #00000040)"
        },
        transform: {
          position: new Vector2(i * 60, -45),
          anchor: new Vector2(0.5, 0.9),
          rotation: i ? -10 : 10,
          size: new Vector2(20, 60)
        }
      }));
      const hand = arm.append(new HTML({
        style: {
          width: "20px",
          height: "20px",
          backgroundColor: "#f9d9ba",
          borderRadius: "50% 50% 2px 2px"
        },
        transform: {
          size: new Vector2(20, 20)
        }
      }));
      this.arms.push(arm);
    }
    let hairShadow = {};
    if (hair === "full") {
      hairShadow = {
        boxShadow: "inset 0px -30px 2px rgba(60, 32, 34, 0.8)"
      };
    } else if (hair === "half") {
      hairShadow = {
        boxShadow: "inset 0px -15px 4px rgba(60, 32, 34, 0.8)"
      };
    }
    this.head = this.torso.append(new HTML({
      style: __spreadValues({
        width: "40px",
        height: "40px",
        backgroundColor: "#f9d9ba",
        borderRadius: "50%",
        filter: "drop-shadow(1px 2px 5px #00000040)"
      }, hairShadow),
      transform: {
        position: new Vector2(20, -5),
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(40, 40)
      }
    }));
    this.animations = glob.bulkAnimations([
      {
        // legs
        duration: 100,
        onChange: (value) => {
          let left = value;
          this.legs[0].transform.setScale(new Vector2(1, left * 2 - 1));
          let right = 1 - value;
          this.legs[1].transform.setScale(new Vector2(1, right * 2 - 1));
        }
      },
      {
        // leftArm Swing
        duration: 200,
        onChange: (value) => {
          let left = Utils.clamp(value, 0, 1);
          this.arms[0].transform.setScale(new Vector2(1, left * 2 - 1));
        }
      },
      {
        // rightArm Swing
        duration: 200,
        onChange: (value) => {
          let right = Utils.clamp(value, 0, 1);
          this.arms[1].transform.setScale(new Vector2(1, right * 2 - 1));
        }
      },
      {
        // leftleg Swing
        duration: 200,
        onChange: (value) => {
          let left = Utils.clamp(value, 0, 1);
          this.legs[0].transform.setScale(new Vector2(1, left * 2 - 1));
        }
      },
      {
        // rightleg Swing
        duration: 200,
        onChange: (value) => {
          let right = Utils.clamp(value, 0, 1);
          this.legs[1].transform.setScale(new Vector2(1, right * 2 - 1));
        }
      }
    ]);
  }
  set animationDuration(duration) {
    this.animations.forEach((animation) => animation.duration = duration);
  }
  lookAngle(angle) {
    this.head.transform.setRotation(Utils.clamp(angle, -40, 40));
  }
  set legPosition([l, r]) {
    this._legPosition = [Utils.clamp(l, 0, 1), Utils.clamp(r, 0, 1)];
    this.animations[3].target = l;
    this.animations[4].target = r;
  }
  set forcelegPosition([l, r]) {
    this._legPosition = [Utils.clamp(l, 0, 1), Utils.clamp(r, 0, 1)];
    this.animations[3].force = l;
    this.animations[4].force = r;
  }
  get legPosition() {
    return this._legPosition;
  }
  set armPosition([l, r]) {
    this._armPosition = [Utils.clamp(l, 0, 1), Utils.clamp(r, 0, 1)];
    this.animations[1].target = l;
    this.animations[2].target = r;
  }
  set forceArmPosition([l, r]) {
    this._armPosition = [Utils.clamp(l, 0, 1), Utils.clamp(r, 0, 1)];
    this.animations[1].force = l;
    this.animations[2].force = r;
    this.animations[1].target = l;
    this.animations[2].target = r;
  }
  get armPosition() {
    return this._armPosition;
  }
  set armTwist([l, r]) {
    this._armTwist = [Utils.clamp(l, -1, 1), Utils.clamp(r, -1, 1)];
    this.forceArmTwist = this._armTwist;
  }
  get armTwist() {
    return this._armTwist;
  }
  set forceArmTwist([l, r]) {
    let left = Utils.clamp(l, -1, 1);
    let right = Utils.clamp(r, -1, 1);
    this.arms[0].transform.setRotation(left * 20);
    this.arms[1].transform.setRotation(right * 20);
  }
};

// ts/classes/sections/office/people/walker.ts
var Walker = class extends HTML {
  get velocity() {
    return this._velocity;
  }
  set velocity(value) {
    this._velocity = value;
  }
  constructor({
    initialPosition = new Vector2(0, 0),
    initialRotation = 0,
    hair = "full",
    walkspeed = 0.8,
    turnDuration = 100
  } = {}) {
    super({
      transform: {
        position: initialPosition,
        rotation: initialRotation,
        anchor: new Vector2(
          0.5,
          0.5
        ),
        size: new Vector2(0, 0)
      },
      style: {
        width: "80px",
        height: "30px"
      }
    });
    this.append(this.person = new Person(hair));
    this.walkspeed = walkspeed;
    this.turnAnimation = glob.addAnimation({ duration: turnDuration, mode: "wrap", onChange: (value) => {
      this.transform.setRotation(value * 360);
    } });
    this.turnAnimation.target = initialRotation / 360;
    this.idle();
  }
  setDestination(destination) {
    this._destination = destination;
    this.turnAnimation.target = this._destination.sub(this.transform.position).angle() / 360;
  }
  get destination() {
    return this._destination;
  }
  tick(obj) {
    super.tick(obj);
    if (this._destination && this.transform.position.distance(this._destination) > 10) {
      this.move(obj, this._destination.sub(this.transform.position).normalize(), this.walkspeed);
    } else {
      this.idle();
    }
  }
  idle() {
    this.legCycle = 0.25;
    this.person.animationDuration = 50;
    this.person.armPosition = [0.5, 0.5];
    this.person.legPosition = [0.5, 0.5];
    this.person.armTwist = [0, 0];
  }
  walkCycle(speed) {
    this.person.animationDuration = 200 - 50 * speed;
    this.legCycle += 0.015 * speed;
    const v = Math.cos(this.legCycle * Math.PI);
    this.person.legPosition = [v < 0 ? 0 : 1, v < 0 ? 1 : 0];
    this.person.armPosition = [v < 0 ? 1 : 0, v < 0 ? 0 : 1];
    this.person.armTwist = [0, 0];
  }
  move(obj, direction, speed) {
    const normalisedSpeed = speed * obj.intervalS20 * 0.15;
    this.transform.setPosition(this.transform.position.add(direction.normalize().scale(normalisedSpeed)));
    this.walkCycle(normalisedSpeed);
  }
};

// ts/classes/sections/office/people/boss.ts
var Boss = class extends Walker {
  constructor(game, position, rotation, hair = "full") {
    super({ initialPosition: position, initialRotation: rotation, hair, walkspeed: 0.7 });
    this.waitTime = 0;
    this.waitTimeMax = 1e4;
    this.collected = 0;
    this._hasPaper = true;
    this.phase = 0;
    this.movement = new Movement(this, "boss", [
      { to: new Vector2(350, 550), speed: 0.7, condition: 1e3 },
      { to: new Vector2(200, 500), speed: 0.7, condition: 1e3 },
      { to: new Vector2(450, 300), speed: 0.7, condition: 1e3 },
      { to: new Vector2(350, 220), speed: 0.7, condition: 500 },
      {
        to: new Vector2(350, 220),
        speed: 0.7,
        condition: () => {
          if (game.computer.completed >= game.computer.target) {
            game.computer.completed -= game.computer.target;
            this.waitTime = 0;
            this.hasPaper = true;
            this.collected++;
            return true;
          }
          this.waitTime += glob.ticker.interval;
          if (this.waitTime > this.waitTimeMax) {
            game.addState("gameover", true);
          }
          return false;
        }
      },
      { to: new Vector2(350, 700), speed: 1, condition: 2e4 },
      {
        to: new Vector2(350, 700),
        speed: 1,
        condition: () => {
          this.hasPaper = false;
          return true;
        }
      }
    ], (speed, velocity, state, phase) => {
      this.phase = phase;
      if (state === "walking") {
        this.turnAnimation.target = velocity.angle() / 360;
      }
      if (state === "waiting") {
        this.idle();
      }
    }, 0);
    this.transform.setPosition(new Vector2(350, 1500));
    this.paper = getPaper(new Vector2(-2, -50), 7, true);
    this.paper.transform.setScale(new Vector2(1, 0.8));
    this.person.append(this.paper);
    this.hasPaper = false;
    this.idle();
  }
  get hasPaper() {
    return this._hasPaper;
  }
  set hasPaper(value) {
    this._hasPaper = value;
    this.paper.visible = value;
  }
  tick(obj) {
    if (glob.params.boss) {
      this.movement.tick(obj);
    }
    if (this.hasPaper) {
      this.person.armPosition = [0.9, this.person.armPosition[1]];
    }
  }
};

// ts/classes/sections/office/people/player.ts
var Player = class extends Walker {
  constructor(office) {
    super({
      initialPosition: new Vector2(300, 300),
      initialRotation: -1,
      hair: "none",
      walkspeed: 1.2
    });
    this.office = office;
    this.idle();
  }
  setDestination(destination) {
    const blockers = this.office.blockers;
    for (const blocker of blockers) {
      if (!destination || destination.x > blocker.position.x && destination.x < blocker.position.x + blocker.size.x && destination.y > blocker.position.y && destination.y < blocker.position.y + blocker.size.y) {
        return;
      }
    }
    super.setDestination(destination);
  }
};

// ts/classes/sections/office/people/sitter.ts
var Sitter = class extends Walker {
  constructor(obj = {}, chair) {
    super({
      hair: obj.hair,
      walkspeed: obj.walkspeed,
      turnDuration: 0
    });
    this.chair = chair;
    this._seated = false;
    this.interpolatedValue = 0;
    this.person.forceArmPosition = obj.armPosition || [1, 1];
    this.data = {
      initialPosition: obj.initialPosition || new Vector2(0, 0),
      initialRotation: obj.initialRotation || 0
    };
    if (this.chair) {
      this.transform.setParent(this.chair.seat.transform);
    } else {
      this.transform.setPosition(this.data.initialPosition);
      this.transform.setRotation(this.data.initialRotation);
    }
    this.legCycle = 0.5;
    this.person.armTwist = [0.5, -0.5];
  }
  set seated(seated) {
    this._seated = seated;
    this.visible = seated;
    this.chair.setRotation(seated ? -1 : 70);
    this.chair.setPosition(seated ? new Vector2(240, 130) : new Vector2(240, 140));
    this.person.armPosition = [seated ? 1 : 0.5, seated ? 1 : 0.5];
  }
  get seated() {
    return this._seated;
  }
  tick(obj) {
    super.tick(obj);
    if (this.chair) {
      this.interpolatedValue = this.interpolatedValue + Math.min(0.02, Number(this.seated) - this.interpolatedValue);
      this.chair.setPosition(this.seated ? new Vector2(240, 130) : new Vector2(240, 140));
      this.transform.setPosition(this.chair.seat.transform.absolute.position.add(this.data.initialPosition));
      this.turnAnimation.target = (this.chair.getRotation() + this.data.initialRotation) / 360;
    }
  }
};

// ts/classes/sections/office/office.ts
var Office = class extends Section {
  constructor(game) {
    super({
      backgroundColor: "#354c59",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center"
    }, {
      size: new Vector2(700, 600),
      position: new Vector2(0, 0),
      index: 0
    }, "office");
    this.game = game;
    this.mouse = false;
    this.blockers = [
      //walls
      {
        position: new Vector2(0, 0),
        size: new Vector2(20, 600)
      },
      {
        position: new Vector2(0, 0),
        size: new Vector2(700, 20)
      },
      {
        position: new Vector2(0, 580),
        size: new Vector2(700, 20)
      },
      {
        position: new Vector2(680, 0),
        size: new Vector2(20, 600)
      },
      // desks
      {
        position: new Vector2(0, 265),
        size: new Vector2(150, 310)
      },
      {
        position: new Vector2(140, 0),
        size: new Vector2(300, 130)
      },
      {
        position: new Vector2(560, 130),
        size: new Vector2(150, 300)
      },
      //chairs 
      {
        position: new Vector2(130, 400),
        size: new Vector2(55, 80)
      },
      {
        position: new Vector2(470, 200),
        size: new Vector2(100, 80)
      },
      // plants
      {
        position: new Vector2(30, 30),
        size: new Vector2(80, 80)
      },
      {
        position: new Vector2(590, 30),
        size: new Vector2(80, 80)
      }
    ];
    this._tired = 0;
    const wrap = this.append(new HTML({
      style: {
        width: "700px",
        height: "600px",
        overflow: "hidden"
      }
    }));
    const floor = wrap.append(new HTML({
      style: {
        width: "100%",
        height: "100%",
        backgroundColor: "#354c59",
        boxShadow: "0px 0px 200px #0000004a",
        overflow: "hidden",
        borderRadius: "10px",
        border: "15px solid #3c5561",
        boxSizing: "border-box"
      }
    }));
    floor.append(new Tile({
      tileSize: new Vector2(80, 120),
      transform: {
        position: new Vector2(150, -240),
        rotation: 30
      },
      offsetRow: new Vector2(0, 0),
      offsetCol: new Vector2(0, 0),
      repeatX: 11,
      repeatY: 7,
      options: {
        style: {
          width: "100px",
          height: "80px",
          border: "10px solid rgb(60, 85, 97)",
          boxSizing: "border-box",
          backgroundColor: "#3c5561",
          borderRadius: "20px"
        },
        transform: {
          rotation: -30
        }
      }
    }));
    wrap.append(this.chair = new Chair(new Vector2(240, 130), -1));
    wrap.append(getDesk(new Vector2(140, 15), -1, 1, {}));
    this.sitter = new Sitter({ initialPosition: new Vector2(35, 40), hair: "none", armPosition: [0, 0] }, this.chair);
    wrap.append(this.sitter);
    wrap.append(new Chair(new Vector2(130, 390), 270, {
      filter: "saturate(0.4)"
    }));
    this.walker = new Player(this);
    wrap.append(this.walker);
    const c = wrap.append(new Chair(new Vector2(480, 200), 120, {
      filter: "saturate(0.4)"
    }));
    wrap.append(getPlant(new Vector2(30, 30), 0, 6, 80));
    wrap.append(getPlant(new Vector2(590, 30), 40, 7, 50));
    wrap.append(getCoffeeMachine(new Vector2(590, 490), 40, 9, 40));
    wrap.append(new Sitter({ initialPosition: new Vector2(520, 240), hair: "full", initialRotation: 120, armPosition: [0, 0] }));
    wrap.append(new Sitter({ initialPosition: new Vector2(170, 430), hair: "none", initialRotation: -90, armPosition: [1, 0] }));
    wrap.append(getDesk(new Vector2(470, 220), 90, 1, {
      filter: "saturate(0.4)"
    }));
    wrap.append(getDesk(new Vector2(-70, 360), 270, 2, {
      filter: "saturate(0.4)"
    }));
    this.npc = new Boss(game, new Vector2(350, 700), 0, "half");
    wrap.append(this.npc);
    this.overlay = this.append(new HTML({
      style: {
        width: "100%",
        height: "100%",
        cursor: "pointer",
        pointerEvents: "all"
      }
    }));
    this.overlay.dom.addEventListener("pointerdown", (e) => {
      this.mouse = true;
      this.walker.setDestination(new Vector2(e.offsetX, e.offsetY));
    });
    this.overlay.dom.addEventListener("pointerup", (e) => {
      this.mouse = false;
    });
    this.overlay.dom.addEventListener("pointerleave", (e) => {
      this.mouse = false;
    });
    this.overlay.dom.addEventListener("pointermove", (e) => {
      if (this.mouse) {
        this.walker.setDestination(new Vector2(e.offsetX, e.offsetY));
      }
    });
    this.tired = 0.15;
  }
  set tired(value) {
    this._tired = Utils.clamp(value, 0, 1);
    this.overlay.setStyle({
      boxShadow: "inset 0px 0px 290px ".concat(Ease.inOutCubic(this._tired) * 360 - 180, "px  #00000080")
    });
    if (this.tired >= 1) {
      this.game.addState("gameover", true);
    }
  }
  get tired() {
    return this._tired;
  }
  tick(obj) {
    super.tick(obj);
    this.tired += obj.interval * 2e-6;
    if (obj.frame % 5 === 0) {
      let t = (this.tired - 0.5) * 2;
      if (t > 0.25) {
        this.setStyle({
          filter: "blur(".concat(Ease.inOutCubic(Math.sin(obj.total * 1e-4 + 0.3) * Math.sin(obj.total * 1e-3 + 0.3) * t) * 2, "px)")
        });
        this.overlay.setStyle({
          backgroundColor: "rgba(0, 0, 0, ".concat(Math.sin(obj.total * 1e-4) * Math.sin(obj.total * 1e-3) * Ease.inOutCubic(t) * 0.3, ")")
        });
      } else {
        this.setStyle({
          filter: "blur(0px)"
        });
        this.overlay.setStyle({
          backgroundColor: "rgba(0, 0, 0, 0)"
        });
      }
    }
  }
};

// ts/classes/sections/statbar.ts
var StatBar = class _StatBar extends Section {
  constructor(parent) {
    super({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "10px",
      boxSizing: "border-box",
      backgroundColor: "transparent",
      boxShadow: "none",
      overflow: "visible",
      gap: "20px",
      pointerEvents: "none"
    }, {
      size: new Vector2(700, 20),
      position: new Vector2(470, 590),
      index: 1,
      sizer: () => {
        return {
          size: new Vector2(700, 40),
          position: new Vector2(0, 570),
          index: 6
        };
      }
    }, "statbar");
    this.parent = parent;
    this.stats = [];
    this.addStat(_StatBar.getStatBlock("person_apron", 50), 0, 0.5, () => {
      return Number(!this.parent.getState("bossinroom"));
    });
    this.addStat(_StatBar.getStatBlock("unknown_document", 50), 0, 0.95, () => {
      return Utils.clamp(1 - this.parent.office.npc.waitTime / this.parent.office.npc.waitTimeMax, 0, 1);
    }, (element, value) => {
      element.setStyle({ backgroundColor: "rgb(".concat(Math.round(153 + (74 - 153) * value), " ").concat(Math.round(60 + (114 - 60) * value), " ").concat(Math.round(60 + (160 - 60) * value), ")") });
    });
    this.addStat(_StatBar.getStatBlock("battery_android_frame_bolt", 50), 0, 0.5, () => {
      return 1 - this.parent.office.tired;
    }, (element, value) => {
      var _a;
      element.setStyle({ backgroundColor: "rgb(".concat(Math.round(153 + (74 - 153) * value), " ").concat(Math.round(60 + (114 - 60) * value), " ").concat(Math.round(60 + (160 - 60) * value), ")") });
      (_a = element.children[0]) == null ? void 0 : _a.setText(["battery_android_bolt", "battery_android_frame_3", "battery_android_frame_5", "battery_android_frame_full"][Math.floor(value * 3.9)]);
    });
  }
  static getStatBlock(icon, size = 40) {
    return new Flex({
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      style: {
        width: "90px",
        height: "90px",
        backgroundColor: "rgb(74 114 160)",
        borderRadius: "50%",
        boxSizing: "border-box",
        fontSize: "25px",
        color: "#fff",
        textAlign: "center",
        whiteSpace: "wrap",
        boxShadow: "inset 3px -10px 30px #0000004f, 1px -3px 7px #0000004f",
        transition: "margin-top 0.5s ease-in-out, opacity 0.5s ease-in-out",
        position: "relative",
        overflow: "hidden",
        opacity: "0"
      },
      children: [
        new Icon(icon, size)
      ]
    });
  }
  addStat(element, value, showOn, getter, setter) {
    this.append(element);
    this.stats.push({
      value,
      element,
      showOn,
      getter,
      setter
    });
  }
  tick(obj) {
    super.tick(obj);
    if (obj.frame % 10 === 0) {
      this.stats.sort((a, b) => a.value - b.value).forEach((stat, index) => {
        var _a;
        stat.value = stat.getter();
        (_a = stat.setter) == null ? void 0 : _a.call(stat, stat.element, stat.value);
        stat.element.setStyle({
          width: stat.value < stat.showOn ? "90px" : "0px"
        });
        stat.element.setStyle({
          marginTop: stat.value < stat.showOn ? "0px" : "20px",
          opacity: stat.value < stat.showOn ? "1" : "0",
          width: stat.value < stat.showOn ? "90px" : "0px"
        });
      });
    }
    ;
  }
};

// ts/classes/animator.ts
var Animator = class {
  constructor(params) {
    this._targetValue = 0;
    this._currentValue = 0;
    this._momentum = 0;
    this.params = __spreadValues({ scale: 1 }, params);
  }
  get value() {
    return this._currentValue;
  }
  set force(v) {
    this._targetValue = v;
    this._currentValue = v;
    this._momentum = 0;
  }
  get target() {
    return this._targetValue;
  }
  set target(v) {
    this._targetValue = v;
  }
  set duration(duration) {
    this.params.duration = duration;
  }
  get duration() {
    return this.params.duration;
  }
  tick(obj) {
    var _a, _b, _c, _d;
    const lastValue = this._currentValue;
    const scale = this.params.scale || 1;
    if (this.params.duration <= 0) {
      this._currentValue = this._targetValue;
      this._momentum = 0;
      if (this._currentValue !== lastValue) {
        (_b = (_a = this.params).onChange) == null ? void 0 : _b.call(_a, this._currentValue);
      }
      return;
    }
    const delta = obj.interval / 1e3;
    const mode = this.params.mode || "linear";
    const distanceToTarget = this.getWrappedDistance(this._currentValue, this._targetValue, mode === "wrap", scale);
    if (Math.abs(distanceToTarget) < 1e-4) {
      this._currentValue = this._targetValue;
      this._momentum *= Math.pow(0.1, delta);
      if (Math.abs(this._momentum) < 1e-4) {
        this._momentum = 0;
      }
      return;
    }
    const absDistance = Math.abs(distanceToTarget);
    const baseSpeed = scale / (this.params.duration / 1e3);
    const targetVelocity = Math.sign(distanceToTarget) * baseSpeed * (absDistance / scale);
    const momentumSmoothing = 5;
    const velocityDiff = targetVelocity - this._momentum;
    this._momentum += velocityDiff * momentumSmoothing * delta;
    const newValue = this._currentValue + this._momentum * delta;
    if (mode === "wrap") {
      this._currentValue = newValue;
      while (this._currentValue > scale) {
        this._currentValue -= scale;
      }
      while (this._currentValue < 0) {
        this._currentValue += scale;
      }
      const newDistanceToTarget = this.getWrappedDistance(this._currentValue, this._targetValue, true, scale);
      if (Math.sign(newDistanceToTarget) !== Math.sign(distanceToTarget) && Math.abs(newDistanceToTarget) > 1e-4) {
        this._currentValue = this._targetValue;
        this._momentum = 0;
      }
    } else {
      if (Math.sign(distanceToTarget) > 0) {
        this._currentValue = Math.min(newValue, this._targetValue);
      } else {
        this._currentValue = Math.max(newValue, this._targetValue);
      }
      if (Math.abs(this._currentValue - this._targetValue) < 1e-4) {
        this._currentValue = this._targetValue;
        this._momentum = 0;
      }
    }
    if (this._currentValue !== lastValue) {
      (_d = (_c = this.params).onChange) == null ? void 0 : _d.call(_c, this._currentValue);
    }
  }
  getWrappedDistance(from, to, useWrapping, scale) {
    if (!useWrapping) {
      return to - from;
    }
    const directDistance = to - from;
    const wrapDistanceRight = scale - from + to;
    const wrapDistanceLeft = -(from + (scale - to));
    const absDirectDistance = Math.abs(directDistance);
    const absWrapRight = Math.abs(wrapDistanceRight);
    const absWrapLeft = Math.abs(wrapDistanceLeft);
    if (absDirectDistance <= absWrapRight && absDirectDistance <= absWrapLeft) {
      return directDistance;
    } else if (absWrapRight <= absWrapLeft) {
      return wrapDistanceRight;
    } else {
      return wrapDistanceLeft;
    }
  }
};

// ts/classes/events.ts
var Timer = class {
  constructor() {
    this.events = [];
    this.currentTime = 0;
  }
  add(key, when, callback) {
    const time = when + this.currentTime;
    const index = this.events.findIndex((event) => event.time > time);
    if (index === -1) {
      this.events.push({
        key,
        time,
        callback
      });
    } else {
      this.events.splice(index, 0, {
        key,
        time,
        callback
      });
    }
  }
  cancel(key) {
    this.events = this.events.filter((event) => event.key !== key);
  }
  call(event, ticker) {
    this.events = this.events.filter((e) => e.key !== event.key);
    event.callback(event.time - this.currentTime, ticker);
  }
  tick(obj) {
    this.currentTime = obj.time;
    for (const event of this.events) {
      if (this.currentTime >= event.time) {
        this.call(event, obj);
      }
      break;
    }
  }
};

// ts/classes/ticker.ts
var Ticker = class {
  constructor(game) {
    this.animations = [];
    this._running = false;
    this.started = false;
    this.pauzedTime = 0;
    this.intervalKeeper = [];
    this.maxRate = 0;
    this.mode = "all";
    this.callbacks = [];
    this.frameN = 0;
    document.addEventListener("visibilitychange", () => {
      if (this.started) {
        this.running = !document.hidden;
      }
    });
    this.timer = new Timer();
  }
  addAnimation(params) {
    const name = Math.random().toString(36).substring(2, 15);
    this.animations.push(new Animator(params));
    return this.animations[this.animations.length - 1];
  }
  get running() {
    return this._running;
  }
  set running(value) {
    this._running = value;
    if (value) {
      this.pTime = performance.now() - this.pauzedTime;
      this.id = window.requestAnimationFrame(this.frame.bind(this));
    } else {
      window.cancelAnimationFrame(this.id);
      this.pauzedTime = performance.now() - this.pTime;
    }
  }
  get startTime() {
    return this.sTime;
  }
  get eTime() {
    return performance.now() - this.sTime;
  }
  averagedInterval(count, interval) {
    const average = this.intervalKeeper.slice(0, count).reduce((partialSum, a) => partialSum + a, 0) / count;
    return Math.abs(interval - average) > 20 ? interval : average;
  }
  frame(timeStamp) {
    if (this.running) {
      const interval = timeStamp - this.pTime;
      this.intervalKeeper = this.intervalKeeper.slice(1, 20);
      this.intervalKeeper.push(interval);
      while (this.intervalKeeper.length < 20) {
        this.intervalKeeper.push(interval);
      }
      this.pTime = timeStamp;
      this.frameN++;
      this.maxRate = Math.max(this.maxRate, 1e3 / interval);
      glob.frame = this.frameN;
      const o = {
        interval,
        totalTime: this.pTime - this.sTime,
        total: this.eTime,
        frameRate: 1e3 / interval,
        frame: this.frameN,
        intervalS3: this.averagedInterval(3, interval),
        intervalS10: this.averagedInterval(10, interval),
        intervalS20: this.averagedInterval(20, interval),
        maxRate: this.maxRate,
        time: timeStamp
      };
      glob.ticker = o;
      this.timer.tick(o);
      if (this.mode === "all" || this.mode === "animations") {
        this.animations.forEach((a) => {
          a.tick(o);
        });
      }
      if (this.mode === "all" || this.mode === "callbacks") {
        this.callbacks.forEach((c) => {
          c(o);
        });
      }
      this.id = window.requestAnimationFrame(this.frame.bind(this));
    }
  }
  start() {
    this.started = true;
    this._running = true;
    this.sTime = performance.now();
    this.pTime = performance.now();
    this.id = window.requestAnimationFrame(this.frame.bind(this));
  }
  add(callback) {
    this.callbacks.push(callback);
  }
  stop() {
    this.running = false;
  }
};

// ts/classes/tilegame.ts
var glob = new class {
  constructor() {
    this.frame = 0;
    this.mobile = false;
  }
  addAnimation(params) {
    return this.game.ticker.addAnimation(params);
  }
  bulkAnimations(params) {
    const animations = [];
    for (const param of params) {
      animations.push(this.addAnimation(param));
    }
    return animations;
  }
}();
var BusyWork4 = class extends HTML {
  constructor() {
    super({
      classList: ["screen"],
      transform: {
        size: new Vector2(700, 600),
        position: new Vector2(0, 0)
      }
    });
    this._mobile = false;
    this.stateData = {};
    glob.game = this;
    this.setupDocument();
    this.setupTicker();
    this.setupParams();
    this.setupGrid();
    this.setupStates();
  }
  addState(state, initial, condition, onChange) {
    var _a, _b;
    this.stateData[state] = {
      value: initial,
      condition,
      onChange
    };
    (_b = (_a = this.stateData[state]).onChange) == null ? void 0 : _b.call(_a, initial);
  }
  getState(state) {
    var _a;
    return (_a = this.stateData[state]) == null ? void 0 : _a.value;
  }
  setupDocument() {
    if (location.hostname !== "localhost") {
      const base = document.createElement("base");
      base.href = "https://basamols.github.io/busywork/dist/";
      document.head.appendChild(base);
    }
    document.body.appendChild(this.dom);
    window.oncontextmenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
    window.addEventListener("resize", () => {
      glob.mobile = window.innerWidth < window.innerHeight;
    });
  }
  setupParams() {
    const url = new URLSearchParams(location.search);
    glob.params = {
      debug: false,
      boss: true,
      initialTired: 0
    };
    url.forEach((value, key) => {
      if (key in glob.params) {
        const key2 = key;
        if (typeof glob.params[key2] === "boolean") {
          glob.params[key2] = value === "true";
        }
        if (typeof glob.params[key2] === "number") {
          glob.params[key2] = Number(value);
        }
      }
    });
  }
  setupGrid() {
    this.append(this.computer = new Computer(this));
    this.append(this.keyboard = new Keyboard(this));
    this.append(this.office = new Office(this), true);
    this.append(this.coffee = new Coffee(this));
    this.append(this.gameover = new Gameover(this));
    this.append(this.statBar = new StatBar(this));
    this.append(this.debug = new Debug(this));
    glob.debug = this.debug;
    this.gridManager = new GridManager(this, [this.computer, this.keyboard, this.office, this.coffee, this.gameover, this.statBar, this.debug]);
    this.ticker.start();
  }
  setupTicker() {
    this.ticker = new Ticker(this);
    this.ticker.add(this.tick.bind(this));
    glob.timer = this.ticker.timer;
  }
  setupStates() {
    this.addState(
      "atdesk",
      false,
      () => {
        return this.office.walker.transform.position.distance(new Vector2(280, 165)) < 60 && (!this.office.walker.destination || this.office.walker.destination.distance(new Vector2(280, 165)) < 60);
      },
      (value) => {
        this.office.sitter.seated = value;
        this.office.walker.visible = !value;
        if (value) {
          this.office.walker.setDestination(void 0);
          this.office.walker.transform.setPosition(new Vector2(280, 160));
        }
      }
    );
    this.addState("atcoffeemachine", false, () => {
      return this.office.walker.transform.position.distance(new Vector2(650, 550)) < 200 && (!this.office.walker.destination || this.office.walker.destination.distance(new Vector2(700, 600)) < 200);
    });
    this.addState("bossinroom", false, () => {
      return this.office.npc.phase > 0 && this.office.npc.phase < 5;
    });
    this.addState("bosslooking", false, () => {
      return this.office.npc.phase > 2 && this.office.npc.phase < 4;
    });
  }
  tick(obj) {
    super.tick(obj);
    Object.values(this.stateData).forEach((data) => {
      const lastValue = data.value;
      if (data.condition) {
        data.value = data.condition();
      }
      if (data.onChange && lastValue !== data.value) {
        data.onChange(data.value);
      }
    });
    this.gridManager.tick();
    this.gameover.tick(obj);
  }
};

// ts/index.ts
document.addEventListener("DOMContentLoaded", async () => {
  const g = new BusyWork4();
});
//# sourceMappingURL=index.js.map
