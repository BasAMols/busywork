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
};

// ts/classes/math/transform.ts
var Transform = class {
  constructor(options = {}) {
    // size of the element
    this._responders = [];
    var _a, _b, _c, _d, _e;
    this._position = (_a = options.position) != null ? _a : new Vector2(0, 0);
    this._scale = (_b = options.scale) != null ? _b : new Vector2(1, 1);
    this._rotation = (_c = options.rotation) != null ? _c : 0;
    this._anchor = (_d = options.anchor) != null ? _d : new Vector2(0, 0);
    this._size = (_e = options.size) != null ? _e : new Vector2(0, 0);
    this._parent = options.parent;
  }
  setParent(parent) {
    this._parent = parent;
    this._update();
  }
  setResponder(responder) {
    this._responders.push(responder);
    responder({ position: this.position, scale: this.scale, rotation: this.rotation, matrix: this.matrix });
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
    return this._size;
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
      return {
        position: this.extractPositionFromMatrix(absoluteMatrix),
        scale: this.extractScaleFromMatrix(absoluteMatrix),
        rotation: this.extractRotationFromMatrix(absoluteMatrix),
        matrix: absoluteMatrix
      };
    }
    return {
      position: this.extractPositionFromMatrix(localMatrix),
      scale: this.extractScaleFromMatrix(localMatrix),
      rotation: this.extractRotationFromMatrix(localMatrix),
      matrix: localMatrix
    };
  }
  getLocalMatrix() {
    const radiansRotation = this._rotation * (Math.PI / 180);
    const cos = Math.cos(radiansRotation);
    const sin = Math.sin(radiansRotation);
    const anchorX = this._anchor.x * this._size.x;
    const anchorY = this._anchor.y * this._size.y;
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
  extractPositionFromMatrix(matrix) {
    return new Vector2(matrix[12], matrix[13]);
  }
  extractScaleFromMatrix(matrix) {
    const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const scaleY = Math.sqrt(matrix[4] * matrix[4] + matrix[5] * matrix[5]);
    return new Vector2(scaleX, scaleY);
  }
  extractRotationFromMatrix(matrix) {
    const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const normalizedX = matrix[0] / scaleX;
    const normalizedY = matrix[1] / scaleX;
    const radiansRotation = Math.atan2(normalizedY, normalizedX);
    return radiansRotation * 180 / Math.PI % 360;
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
      responder({ position: this.position, scale: this.scale, rotation: this.rotation, matrix: this.matrix });
    });
  }
};

// ts/classes/element/element.ts
var HTML = class {
  constructor(options = {}) {
    this._visible = true;
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
    this.setStyle(this.options.style);
    this.transform = new Transform(this.options.transform);
    this.transform.setResponder(({ matrix, position, scale, rotation }) => {
      this.dom.style.transformOrigin = "0 0";
      this.dom.style.transform = "matrix3d(".concat(matrix.join(","), ")");
    });
    if (options.onMouseDown) {
      this.dom.addEventListener("mousedown", () => {
        this.options.onMouseDown();
      });
    }
    if (options.onMouseUp) {
      this.dom.addEventListener("mouseup", () => {
        this.options.onMouseUp();
      });
    }
    if (options.onClick) {
      this.dom.addEventListener("click", () => {
        this.options.onClick();
      });
    }
    if (options.onMouseMove) {
      this.dom.addEventListener("mousemove", (e) => {
        this.options.onMouseMove(e);
      });
    }
    if (options.onMouseEnter) {
      this.dom.addEventListener("mouseenter", () => {
        this.options.onMouseEnter();
      });
    }
    if (options.onMouseLeave) {
      this.dom.addEventListener("mouseleave", () => {
        this.options.onMouseLeave();
      });
    }
    this.setText(this.options.text);
  }
  append(element, absolute = false) {
    this.dom.appendChild(element.dom);
    if (!absolute) {
      element.transform.setParent(this.transform);
    }
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
  tick(obj) {
  }
};

// ts/classes/ticker.ts
var Ticker = class {
  constructor() {
    this._running = false;
    this.started = false;
    this.pauzedTime = 0;
    this.intervalKeeper = [];
    this.maxRate = 0;
    this.callbacks = [];
    this.frameN = 0;
    document.addEventListener("visibilitychange", () => {
      if (this.started) {
        this.running = !document.hidden;
      }
    });
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
    return Math.abs(interval - average) > 10 ? interval : average;
  }
  frame(timeStamp) {
    if (this.running) {
      const interval = timeStamp - this.pTime;
      this.intervalKeeper.push(interval);
      this.intervalKeeper = this.intervalKeeper.slice(0, 20);
      while (this.intervalKeeper.length < 20) {
        this.intervalKeeper.push(this.intervalKeeper[0]);
      }
      this.pTime = timeStamp;
      this.frameN++;
      this.maxRate = Math.max(this.maxRate, 1e3 / interval);
      glob.frame = this.frameN;
      const o = {
        interval,
        total: this.eTime,
        frameRate: 1e3 / interval,
        frame: this.frameN,
        intervalS3: this.averagedInterval(3, interval),
        intervalS10: this.averagedInterval(5, interval),
        intervalS20: this.averagedInterval(20, interval),
        maxRate: this.maxRate
      };
      glob.ticker = o;
      this.callbacks.forEach((c) => {
        c(o);
      });
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
};

// ts/base.ts
var glob = new class {
  constructor() {
    this.frame = 0;
  }
}();
var Game = class extends HTML {
  constructor() {
    super({ style: { width: "100%", height: "100%" } });
    this.screens = {};
    glob.game = this;
    this.init();
  }
  init() {
    this.ticker = new Ticker();
    this.ticker.add(this.tick.bind(this));
    this.ticker.start();
  }
  addScreen(screen) {
    this.screens[screen.key] = screen;
    this.append(screen);
    return screen;
  }
  tick(obj) {
    Object.values(this.screens).forEach((screen) => {
      screen.tick(obj);
    });
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
  }
};

// ts/classes/element/screen.ts
var Screen = class extends HTML {
  constructor(key) {
    super({ type: "div", style: { width: "100%", height: "100%", backgroundColor: "#2a3e48" }, classList: ["screen"] });
    this.key = key;
  }
  tick(obj) {
  }
};

// ts/classes/busywork/util/section.ts
var Section = class extends HTML {
  constructor(size, style) {
    super({
      style: __spreadValues({
        width: size.x + "px",
        height: size.y + "px",
        boxShadow: "0px 0px 200px #0000004a",
        overflow: "hidden",
        borderRadius: "10px"
      }, style),
      transform: {
        size
      }
    });
  }
};

// ts/classes/busywork/screens/main/sections/computer/computer.ts
var Computer = class extends Section {
  constructor(sitter) {
    super(new Vector2(450, 440), {
      backgroundColor: "#90857f",
      boxShadow: "0px 0px 200px #0000004a",
      transition: "width 0.6s ease-in-out"
    });
    this._text = "";
    this._code = void 0;
    this.screen = this.append(new HTML({
      style: {
        width: "440px",
        height: "330px",
        backgroundColor: "#222432",
        boxShadow: "inset rgb(0 0 0) 6px 3px 200px 3px",
        borderRadius: "30px",
        overflow: "hidden",
        cursor: "none"
      },
      transform: {
        position: new Vector2(5, 30)
      },
      onMouseEnter: () => {
        this.cursor.visible = true;
      },
      onMouseMove: (e) => {
        this.cursor.transform.setPosition(new Vector2(e.offsetX, e.offsetY));
        sitter.person.armTwist = [0.5, 2];
      },
      onMouseLeave: () => {
        sitter.person.armTwist = [0.5, -0.5];
        this.cursor.visible = false;
      }
    }));
    this.textElement = this.screen.append(new Flex({
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      style: {
        width: "100%",
        height: "100%",
        fontSize: "100px",
        color: "#fff",
        fontWeight: "bold",
        lineHeight: "90px",
        fontFamily: "monospace",
        borderRadius: "30px",
        boxShadow: "inset rgb(0 0 0) 6px 3px 200px 3px",
        pointerEvents: "none",
        filter: "sepia(0.6) blur(1px)",
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
        filter: "drop-shadow(3px 6px 6px #000000ff) blur(1px)",
        pointerEvents: "none"
      },
      transform: {
        position: new Vector2(30, 40),
        scale: new Vector2(0.25, 0.25),
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
    this.setCode("0121");
    this.setTT("");
  }
  setCode(code) {
    this._code = code;
  }
  setTT(text) {
    var _a, _b;
    if (!this._code)
      return;
    if (text.length > this._code.length)
      return;
    this._text = text;
    this.textElement.setText(text.padEnd(((_a = this._code) == null ? void 0 : _a.length) || 4, "_"));
    if (this._text.length >= ((_b = this._code) == null ? void 0 : _b.length)) {
      if (this._text.substring(0, this._code.length) === this._code) {
        this.screen.setStyle({
          backgroundColor: "#456c44"
        });
        this.setCode(void 0);
        setTimeout(() => {
          const code = Array.from({ length: 4 }, () => Math.floor(Math.random() * 3).toString()).join("");
          this.setCode(code);
          this.setTT("");
        }, 1e3);
      } else {
        this.screen.setStyle({
          backgroundColor: "#6c4444"
        });
        setTimeout(() => {
          this.setTT("");
        }, 400);
      }
    } else {
      this.screen.setStyle({
        backgroundColor: "#222432"
      });
    }
  }
  addTT(text) {
    this.setTT(this._text + text);
  }
  tick(obj) {
    this.scanline.transform.setPosition(new Vector2(0, obj.total % 4e3 / 4e3 * 700 - 100));
  }
};

// ts/classes/element/button.ts
var Button = class extends HTML {
  constructor(options) {
    super(__spreadProps(__spreadValues({}, options), { classList: [...options.classList || [], "_button"] }));
    this.setText(this.options.text);
  }
};

// ts/classes/busywork/screens/main/sections/keyboard/asset.ts
function getBigKeyboard(position, rotation, onMouseDown, onMouseUp) {
  const wrap = new HTML({
    style: {
      width: "450px",
      height: "140px",
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
  for (let i = 0; i < 3; i++) {
    let e;
    const b = new Button({
      style: {
        width: "94px",
        height: "94px",
        backgroundColor: "#a59c96",
        borderRadius: "14px",
        boxShadow: "10px 10px 2px #00000030, inset 28px 28px 28px #00000020",
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
      text: i.toString(),
      onMouseDown: () => {
        b.dom.style.boxShadow = "3px 3px 0px #00000040, inset 28px 28px 28px #00000020";
        onMouseDown(i);
      },
      onMouseUp: () => {
        b.dom.style.boxShadow = "10px 10px 2px #00000030, inset 28px 28px 28px #00000020";
        onMouseUp();
      },
      transform: {
        position: new Vector2(50 + i * (18 * 7), 14),
        anchor: new Vector2(0.5, 0.5)
      }
    });
    wrap.append(buttons[i] = b);
  }
  return wrap;
}

// ts/classes/busywork/screens/main/sections/keyboard/keyboard.ts
var Keyboard = class extends Section {
  constructor(computer, sitter) {
    super(new Vector2(450, 140), {});
    this.append(getBigKeyboard(new Vector2(0, 0), 0, (key) => {
      computer.addTT(key.toString());
      if (key === 0) {
        sitter.person.armTwist = [0.2, -0.5];
      } else if (key === 1) {
        sitter.person.armTwist = [1, -0.5];
      } else if (key === 2) {
        sitter.person.armTwist = [0.5, -0.8];
      }
    }, () => {
      sitter.person.armTwist = [0.5, -0.5];
    }));
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

// ts/classes/busywork/screens/main/sections/office/clutter.ts
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

// ts/classes/busywork/screens/main/sections/office/prop.ts
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
  for (let i = 0; i < 3; i++) {
    let e;
    const b = new HTML({
      style: {
        width: "14px",
        height: "14px",
        backgroundColor: "#a59c96",
        borderRadius: "2px",
        boxShadow: "1px 1.8px 1px #00000040, inset 2px 2px 3px #00000020",
        cursor: "pointer",
        padding: "0px",
        border: "none"
      },
      transform: {
        position: new Vector2(5 + i * 18, 2),
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(14, 14)
      }
    });
    wrap.append(b);
  }
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

// ts/classes/busywork/screens/main/sections/office/furniture.ts
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
    if (this.seat.transform.rotation !== rotation) {
    }
  }
  setPosition(position) {
    this.transform.setPosition(position);
  }
  getPosition() {
    return this.seat.transform.absolute;
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
        borderRadius: "10px",
        transition: "rotate 0.8s ease-in-out, left 0.8s ease-in-out, top 0.8s ease-in-out"
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

// ts/classes/math/util.ts
var Utils = class {
  static clamp(value, min, max) {
    if (typeof value === "number" && typeof min === "number" && typeof max === "number") {
      return Math.max(min, Math.min(value, max));
    } else if (value instanceof Vector2 && min instanceof Vector2 && max instanceof Vector2) {
      return new Vector2(Math.max(min.x, Math.min(value.x, max.x)), Math.max(min.y, Math.min(value.y, max.y)));
    }
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

// ts/classes/busywork/screens/main/sections/office/people/person.ts
var Person = class extends HTML {
  constructor(hair = "full") {
    super({
      style: {
        width: "80px",
        height: "30px"
      },
      transform: {
        position: new Vector2(-40, -15),
        size: new Vector2(80, 30),
        anchor: new Vector2(0.5, 0.5)
      }
    });
    this.arms = [];
    this.legs = [];
    this._legCycle = 0;
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
    this.legCycle = 2;
    this.armTwist = [0, 0];
  }
  lookAngle(angle) {
    this.head.transform.setRotation(Utils.clamp(angle, -40, 40));
  }
  get legCycle() {
    return this._legCycle;
  }
  set legCycle(v) {
    this._legCycle = v % 2;
    const value = Ease.inOutCirc(this._legCycle <= 1 ? this._legCycle : 2 - this._legCycle);
    this.legs[0].transform.setScale(new Vector2(1, 1 - value * 2));
    this.legs[1].transform.setScale(new Vector2(1, -1 + value * 2));
  }
  set armPosition([l, r]) {
    this._armPosition = [Utils.clamp(l, -1, 1), Utils.clamp(r, -1, 1)];
    this.forceArmPosition = this._armPosition;
  }
  set forceArmPosition([l, r]) {
    let left = Utils.clamp(l, -1, 1);
    let right = Utils.clamp(r, -1, 1);
    this.arms[0].transform.setScale(new Vector2(1, left));
    this.arms[1].transform.setScale(new Vector2(1, right));
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

// ts/classes/busywork/screens/main/sections/office/people/walker.ts
var Walker = class extends HTML {
  constructor({ initialPosition = new Vector2(0, 0), initialRotation = 0, hair = "full", walkspeed = 0.8 } = {}) {
    super({
      transform: {
        position: initialPosition,
        rotation: initialRotation,
        anchor: new Vector2(0.5, 0.5),
        size: new Vector2(0, 0)
      },
      style: {}
    });
    this.append(this.person = new Person(hair));
    this.person.armPosition = [0, 0];
    this.walkspeed = walkspeed;
  }
  setDestination(destination) {
    this._destination = destination;
  }
  get destination() {
    return this._destination;
  }
  lookAt(destination) {
    this._lookAt = destination;
  }
  /**
   * Calculate the shortest angular distance between two angles
   * Returns a value between -180 and 180 degrees
   */
  getShortestAngleDifference(currentAngle, targetAngle) {
    let diff = targetAngle - currentAngle;
    while (diff > 180)
      diff -= 360;
    while (diff < -180)
      diff += 360;
    return diff;
  }
  tick(obj) {
    const angle = this._lookAt ? this._lookAt.sub(this.transform.position).angle() : this.transform.rotation;
    if (this._destination && this.transform.position.distance(this._destination) > 10) {
      this.transform.setPosition(this.transform.position.add(this._destination.sub(this.transform.position).normalize().scale(this.walkspeed)));
      this.transform.setRotation(this._destination.sub(this.transform.position).angle());
      this.person.legCycle += 0.011 * this.walkspeed;
      const rightArm = Math.cos(this.person.legCycle * Math.PI);
      const leftArm = -rightArm;
      this.person.forceArmPosition = [leftArm * 0.8, rightArm * 0.8];
      this.person.forceArmTwist = [0, 0];
      this.person.lookAngle(Utils.clamp(angle - this.transform.rotation, -20, 20));
    } else {
      const angleDiff = this.getShortestAngleDifference(this.transform.rotation, angle);
      if (angleDiff > 40) {
        this.transform.setRotation(angle - 40);
      } else if (angleDiff < -40) {
        this.transform.setRotation(angle + 40);
      }
      this.person.legCycle = 0.5;
      this.person.armPosition = this.person.armPosition;
      this.person.armTwist = this.person.armTwist;
      this.person.lookAngle(angle - this.transform.rotation);
    }
  }
};

// ts/classes/busywork/screens/main/sections/office/people/boss.ts
var Boss = class extends Walker {
  constructor(position, rotation, hair = "full") {
    super({ initialPosition: position, initialRotation: rotation, hair, walkspeed: 0.7 });
    this.time = 0;
  }
  tick(obj) {
    this.time = obj.total % 5e4;
    if (this.time < 1e3) {
      this.setDestination(new Vector2(350, 550));
      this.lookAt(new Vector2(350, 0));
    } else if (this.time < 1e4) {
      this.setDestination(new Vector2(200, 500));
      this.lookAt(new Vector2(120, 400));
    } else if (this.time < 2e4) {
      this.setDestination(new Vector2(450, 300));
      this.lookAt(new Vector2(480, 290));
    } else if (this.time < 24e3) {
      this.setDestination(new Vector2(350, 220));
      this.lookAt(new Vector2(300, 150));
    } else {
      this.setDestination(new Vector2(350, 700));
      this.lookAt(new Vector2(350, 1e3));
    }
    super.tick(obj);
  }
};

// ts/classes/busywork/screens/main/sections/office/people/player.ts
var Player = class extends Walker {
  constructor(office) {
    super({
      initialPosition: new Vector2(500, 560),
      initialRotation: -1,
      hair: "none",
      walkspeed: 0.8
    });
    this.office = office;
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

// ts/classes/busywork/screens/main/sections/office/people/sitter.ts
var Sitter = class extends Walker {
  constructor(obj = {}, chair) {
    super({
      hair: obj.hair,
      walkspeed: obj.walkspeed
    });
    this.chair = chair;
    this.data = {
      initialPosition: obj.initialPosition || new Vector2(0, 0),
      initialRotation: obj.initialRotation || 0
    };
    this.person.legCycle = 0.5;
    this.person.armPosition = [1, 1];
    this.person.armTwist = [0.5, -0.5];
    this.person.arms[0].setStyle({
      transition: "transform 0.1s ease-in-out"
    });
    this.person.arms[1].setStyle({
      transition: "transform 0.1s ease-in-out"
    });
    this.setStyle({
      transition: "transform 0.8s ease-in-out"
    });
  }
  tick(obj) {
    super.tick(obj);
    console.log(this.chair.seat.transform.absolute.position);
    this.transform.setPosition(this.chair.seat.transform.absolute.position.add(this.data.initialPosition));
    this.transform.setRotation(this.chair.seat.transform.absolute.rotation + this.data.initialRotation);
  }
};

// ts/classes/busywork/screens/main/sections/office/office.ts
var Office = class extends Section {
  constructor() {
    super(new Vector2(700, 600), {
      backgroundColor: "#354c59",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transition: "width 0.8s ease-in-out"
    });
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
      },
      {
        position: new Vector2(590, 490),
        size: new Vector2(80, 80)
      }
    ];
    const wrap = this.append(new HTML({
      style: {
        width: "700px",
        height: "600px",
        position: "relative"
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
    wrap.append(this.chair = new Chair(new Vector2(240, 120), -1));
    wrap.append(getDesk(new Vector2(140, 15), -1, 1, {}));
    this.sitter = new Sitter({ initialPosition: new Vector2(40, 20), hair: "none" }, this.chair);
    wrap.append(this.sitter);
    wrap.append(new Chair(new Vector2(480, 200), 120, {
      filter: "saturate(0.4)"
    }));
    wrap.append(new Chair(new Vector2(100, 400), 264, {
      filter: "saturate(0.4)"
    }));
    this.walker = new Player(this);
    wrap.append(this.walker);
    wrap.append(getDesk(new Vector2(470, 220), 90, 1, {
      filter: "saturate(0.4)"
    }));
    wrap.append(getDesk(new Vector2(-70, 360), 270, 2, {
      filter: "saturate(0.4)"
    }));
    wrap.append(getPlant(new Vector2(30, 30), 0, 6, 80));
    wrap.append(getPlant(new Vector2(590, 30), 40, 7, 50));
    wrap.append(getPlant(new Vector2(590, 490), 40, 9, 40));
    this.npc = new Boss(new Vector2(350, 700), 0, "half");
    wrap.append(this.npc);
    const overlay = this.append(new HTML({
      style: {
        width: "100%",
        height: "100%",
        cursor: "pointer"
      }
    }));
    overlay.dom.addEventListener("mousedown", (e) => {
      this.mouse = true;
      this.walker.setDestination(new Vector2(e.offsetX, e.offsetY));
    });
    overlay.dom.addEventListener("mouseup", (e) => {
      this.mouse = false;
    });
    overlay.dom.addEventListener("mousemove", (e) => {
      if (this.mouse) {
        this.walker.setDestination(new Vector2(e.offsetX, e.offsetY));
      } else {
        this.walker.lookAt(new Vector2(e.offsetX, e.offsetY));
      }
    });
  }
  tick(obj) {
    this.walker.tick(obj);
    this.npc.tick(obj);
    this.sitter.tick(obj);
  }
};

// ts/classes/busywork/main.ts
var TileGame = class extends Screen {
  constructor(game) {
    super("test");
    this.game = game;
    this.states = {
      "atdesk": false
    };
    this.stateData = {};
    const row = this.append(this.getRow(true, true));
    row.append(this.office = new Office(), true);
    this.computerCol = row.append(this.getCol(false, false, {
      transition: "width 0.8s ease-in-out"
    }));
    this.computerCol.append(this.computer = new Computer(this.office.sitter));
    this.computerCol.append(this.keyboard = new Keyboard(this.computer, this.office.sitter));
    this.addState(
      "atdesk",
      false,
      () => {
        return this.office.walker.transform.position.distance(new Vector2(280, 165)) < 30 && (!this.office.walker.destination || this.office.walker.destination.distance(new Vector2(280, 165)) < 30);
      },
      (value) => {
        this.computerCol.dom.style.width = value ? "450px" : "0px";
        this.office.dom.style.width = value ? "500px" : "700px";
        this.office.walker.visible = !value;
        this.office.sitter.visible = value;
        this.office.chair.seat.transform.setRotation(value ? -1 : 120);
        this.office.chair.setPosition(value ? new Vector2(240, 120) : new Vector2(240, 140));
        if (value) {
          this.office.walker.setDestination(void 0);
          this.office.walker.transform.setPosition(new Vector2(280, 165));
        }
      }
    );
    this.addState(
      "bossinroom",
      false,
      () => {
        return this.office.npc.time > 1500 && this.office.npc.time < 27e3;
      },
      (value) => {
        console.log("bossinroom", value);
      }
    );
    this.addState(
      "bosslooking",
      false,
      () => {
        return this.office.npc.time > 21e3 && this.office.npc.time < 24e3;
      },
      (value) => {
        console.log("bosslooking", value);
      }
    );
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
  getCol(width = false, height = false, style = {}) {
    return new Flex({
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      style: __spreadValues({
        overflow: "hidden",
        width: width ? "100%" : "auto",
        height: height ? "100%" : "auto"
      }, style)
    });
  }
  getRow(width = false, height = false, style = {}) {
    return new Flex({
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      style: __spreadValues({
        width: width ? "100%" : "auto",
        height: height ? "100%" : "auto"
      }, style)
    });
  }
  syncStates() {
    Object.values(this.stateData).forEach((data) => {
      const lastValue = data.value;
      if (data.condition) {
        data.value = data.condition();
      }
      if (data.onChange && lastValue !== data.value) {
        data.onChange(data.value);
      }
    });
  }
  tick(obj) {
    this.office.tick(obj);
    this.computer.tick(obj);
    this.keyboard.tick(obj);
    this.syncStates();
  }
};

// ts/classes/element/label.ts
var Label = class extends HTML {
  constructor(options) {
    super(__spreadProps(__spreadValues({}, options), { classList: [...options.classList || [], "_label"] }));
    this.setStyle({
      fontSize: "".concat(options.size, "px"),
      color: options.color,
      fontFamily: options.font,
      fontWeight: options.weight,
      textAlign: options.align,
      lineHeight: options.lineHeight,
      letterSpacing: options.letterSpacing
    });
  }
};

// ts/classes/busywork/screens/menu.ts
var Menu = class extends Screen {
  constructor(game) {
    super("menu");
    this.game = game;
    const column = this.append(new Flex({
      flexDirection: "column",
      gap: 20,
      alignItems: "center",
      justifyContent: "center",
      style: {
        width: "100%",
        height: "100%"
      }
    }));
    const row1 = column.append(new Flex({
      gap: 10,
      alignItems: "center",
      justifyContent: "center"
    }));
    const row2 = column.append(new Flex({
      gap: 10,
      alignItems: "center",
      justifyContent: "center"
    }));
    row1.append(new Label({ text: "Busywork", size: 20, color: "white", weight: "bold", font: "Arial, sans-serif" }));
    row2.append(new Button({ text: "Click me", style: { backgroundColor: "#2198c9", color: "white", borderRadius: "5px" }, onClick: () => {
      this.game.start();
    } }));
  }
};

// game.ts
var Busywork = class extends Game {
  constructor() {
    super();
    this.addScreen(new Menu(this));
    this.addScreen(new TileGame(this));
  }
  run() {
    this.screens["menu"].visible = false;
    this.screens["test"].visible = true;
  }
  start() {
    this.screens["menu"].visible = false;
    this.screens["test"].visible = true;
  }
};

// ts/index.ts
document.addEventListener("DOMContentLoaded", async () => {
  const g = new Busywork();
  g.run();
  document.body.appendChild(g.dom);
});
//# sourceMappingURL=index.js.map
