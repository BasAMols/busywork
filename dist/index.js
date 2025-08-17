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
  hasParent() {
    return this._parent !== void 0;
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
    this.transform.setResponder(({ matrix, position, scale, rotation }) => {
      this.dom.style.transformOrigin = "0 0";
      this.dom.style.transform = "matrix3d(".concat(matrix.join(","), ")");
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
  append(element, absolute = false) {
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
  tick(obj) {
    if (this.visible) {
      this.children.forEach((child) => {
        child.tick(obj);
      });
    }
  }
};

// ts/classes/busywork/events.ts
var Timer = class {
  constructor(game) {
    this.game = game;
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

// ts/classes/busywork/ticker.ts
var Ticker = class {
  constructor(game) {
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
    this.timer = new Timer(game);
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

// ts/classes/busywork/base.ts
var glob = new class {
  constructor() {
    this.frame = 0;
    this.mobile = false;
  }
}();
var Game2 = class extends HTML {
  constructor() {
    super({ style: { width: "100%", height: "100%" } });
    this.screens = {};
    glob.game = this;
    this.init();
  }
  init() {
    this.ticker = new Ticker(this);
    this.ticker.add(this.tick.bind(this));
    this.ticker.start();
    glob.timer = this.ticker.timer;
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

// ts/classes/element/screen.ts
var Screen = class extends Flex {
  constructor(key) {
    super({
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      style: {
        width: "100%",
        height: "100%",
        backgroundColor: "#2a3e48",
        transition: "transform 0.6s ease-in-out"
      },
      classList: ["screen"]
    });
    this.key = key;
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
};

// ts/classes/busywork/screens/main/util/section.ts
var Section = class extends HTML {
  constructor(size, style, gridParams = [1, 1, 1, 1]) {
    super({
      style: __spreadValues({
        width: size.x + "px",
        height: size.y + "px",
        // boxShadow: '0px 0px 200px #0000004a',
        transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1), margin-left 1s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        borderRadius: "10px",
        gridColumn: gridParams[0] + " / span " + gridParams[1],
        gridRow: gridParams[2] + " / span " + gridParams[3]
      }, style),
      transform: {
        size
      }
    });
  }
};

// ts/classes/busywork/screens/main/sections/computer/computer.ts
var Computer = class extends Section {
  constructor(parent, gridParams) {
    super(new Vector2(450, 350), {
      backgroundColor: "#90857f",
      boxShadow: "0px 0px 200px #0000004a",
      width: "100%",
      height: "350px",
      justifyContent: "flex-start",
      overflow: "hidden"
    }, gridParams);
    this.parent = parent;
    this._text = "";
    this._code = void 0;
    this._completed = 0;
    this.target = 3;
    if (Utils.isMobile()) {
      this.dom.style.width = "450px";
      this.dom.style.height = "100%";
    } else {
      this.dom.style.width = "100%";
      this.dom.style.height = "350px";
    }
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
        position: new Vector2(5, 10)
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
    this.completed = 0;
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
    if (this.parent.office.tired > 0.25) {
      this.setStyle({
        filter: "blur(".concat(Ease.inOutCubic(Math.sin(obj.total * 1e-4 + 0.2) * Math.sin(obj.total * 1e-3 + 0.2) * this.parent.office.tired) * 4, "px)")
      });
    } else {
      this.setStyle({
        filter: "blur(0px)"
      });
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

// ts/classes/busywork/screens/main/sections/keyboard/asset.ts
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

// ts/classes/busywork/screens/main/sections/keyboard/keyboard.ts
var Keyboard = class extends Section {
  constructor(parent, gridParams) {
    super(new Vector2(450, 230), {
      width: "100%",
      height: "100%",
      justifyContent: "flex-start",
      overflow: "hidden"
    }, gridParams);
    this.parent = parent;
    if (Utils.isMobile()) {
      this.dom.style.width = "450px";
      this.dom.style.height = "100%";
    } else {
      this.dom.style.width = "100%";
      this.dom.style.height = "230px";
    }
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
  }
  get sitter() {
    return this.parent.office.sitter;
  }
  get computer() {
    return this.parent.computer;
  }
  tick(obj) {
    super.tick(obj);
    if (this.parent.office.tired > 0.25) {
      this.setStyle({
        filter: "blur(".concat(Ease.inOutCubic(Math.sin(obj.total * 1e-4 + 0.2) * Math.sin(obj.total * 1e-3 + 0.2) * this.parent.office.tired) * 4, "px)")
      });
    } else {
      this.setStyle({
        filter: "blur(0px)"
      });
    }
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
        height: "80px",
        transition: "transform 0.8s ease-in-out"
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
        transition: "transform 0.8s ease-in-out, left 0.8s ease-in-out, top 0.8s ease-in-out"
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

// ts/classes/busywork/screens/main/util/movement.ts
var Movement = class {
  constructor(actor, key, cycle, callback, state = 0) {
    this.actor = actor;
    this.key = key;
    this.cycle = cycle;
    this.callback = callback;
    this.state = "walking";
    this.index = 0;
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
    this.callback(0, new Vector2(0, 0), "waiting", cycle.time - glob.timer.currentTime, this.index);
  }
  move(cycle, obj) {
    const velocity = cycle.to.sub(this.actor.transform.position).normalize().scale(cycle.speed);
    this.actor.move(obj, velocity, cycle.speed);
    this.callback(cycle.speed, velocity, "walking", 0, this.index);
    if (this.actor.transform.position.distance(cycle.to) < 1) {
      this.state = "waiting";
      if (cycle.time < 1) {
        this.next();
      } else {
        glob.timer.add("".concat(this.key, "-walk"), cycle.time, () => {
          this.next();
        });
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

// ts/classes/busywork/screens/main/sections/office/people/assets.ts
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
      style: {
        width: "80px",
        height: "30px"
      }
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
    super.tick(obj);
    const angle = this._lookAt ? this._lookAt.sub(this.transform.position).angle() : this.transform.rotation;
    if (this._destination && this.transform.position.distance(this._destination) > 10) {
      this.move(obj, this._destination.sub(this.transform.position).normalize(), this.walkspeed);
      this.transform.setRotation(this.transform.position.sub(this._destination).angle());
      this.person.lookAngle(Utils.clamp(angle - this.transform.rotation, -20, 20));
    } else {
      const angleDiff = this.getShortestAngleDifference(this.transform.rotation, angle);
      if (angleDiff > 40) {
        this.transform.setRotation(angle - 40);
      } else if (angleDiff < -40) {
        this.transform.setRotation(angle + 40);
      }
      this.idle();
    }
  }
  idle() {
    this.person.legCycle = 0.5;
    this.person.armPosition = this.person.armPosition;
    this.person.armTwist = this.person.armTwist;
  }
  walkCycle(speed) {
    this.person.legCycle += 0.011 * speed;
    const rightArm = Math.cos(this.person.legCycle * Math.PI);
    const leftArm = -rightArm;
    this.person.forceArmPosition = [leftArm * 0.8 * speed, rightArm * 0.8 * speed];
    this.person.forceArmTwist = [0, 0];
  }
  move(obj, direction, speed) {
    const normalisedSpeed = speed * obj.intervalS20 * 0.15;
    this.transform.setPosition(this.transform.position.add(direction.normalize().scale(normalisedSpeed)));
    this.walkCycle(normalisedSpeed);
  }
};

// ts/classes/busywork/screens/main/sections/office/people/boss.ts
var Boss = class extends Walker {
  constructor(position, rotation, hair = "full") {
    super({ initialPosition: position, initialRotation: rotation, hair, walkspeed: 0.7 });
    this.rotation = 0;
    this.rotationTarget = 0;
    this.phase = 0;
    this.movement = new Movement(this, "boss", [
      { to: new Vector2(350, 550), speed: 0.7, time: 100 },
      { to: new Vector2(200, 500), speed: 0.7, time: 3e3 },
      { to: new Vector2(450, 300), speed: 0.7, time: 3e3 },
      { to: new Vector2(350, 220), speed: 0.7, time: 3e3 },
      { to: new Vector2(350, 700), speed: 1, time: 2e4 }
    ], (speed, velocity, state, time, phase) => {
      this.phase = phase;
      if (state === "walking") {
        this.rotationTarget = velocity.angle();
        this.walkCycle(speed);
      }
      if (state === "waiting") {
        this.idle();
      }
    }, 0);
  }
  tick(obj) {
    this.movement.tick(obj);
    if (Math.abs(this.rotation - this.rotationTarget) > 1) {
      if (this.rotation - this.rotationTarget > 180) {
        this.rotationTarget = this.rotationTarget + 360;
      } else if (this.rotation - this.rotationTarget < -180) {
        this.rotationTarget = this.rotationTarget - 360;
      }
      this.rotation = Utils.lerp(this.rotation, this.rotationTarget, 0.05);
      this.transform.setRotation(this.rotation);
    }
  }
};

// ts/classes/busywork/screens/main/sections/office/people/player.ts
var Player = class extends Walker {
  constructor(office) {
    super({
      initialPosition: new Vector2(300, 300),
      initialRotation: -1,
      hair: "none",
      walkspeed: 1.2
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
    this._seated = false;
    this.interpolatedValue = 0;
    this.person.armPosition = obj.armPosition || [1, 1];
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
    this.person.legCycle = 0.5;
    this.person.armTwist = [0.5, -0.5];
    this.person.arms[0].setStyle({
      // transition: 'transform 0.1s ease-in-out',
    });
    this.person.arms[1].setStyle({
      // transition: 'transform 0.1s ease-in-out',
    });
    this.setStyle({
      transition: "transform 0.8s ease-in-out"
    });
  }
  set seated(seated) {
    this._seated = seated;
    this.visible = seated;
    this.chair.seat.transform.setRotation(seated ? -1 : 70);
    this.chair.setPosition(seated ? new Vector2(240, 130) : new Vector2(240, 140));
  }
  get seated() {
    return this._seated;
  }
  tick(obj) {
    super.tick(obj);
    if (this.chair) {
      this.interpolatedValue = this.interpolatedValue + Math.min(0.02, Number(this.seated) - this.interpolatedValue);
      this.person.armPosition = [this.interpolatedValue, this.interpolatedValue];
      this.person.arms[0].dom.style.transition = this.interpolatedValue === 1 ? "transform 0.1s ease-in-out" : "none";
      this.person.arms[1].dom.style.transition = this.interpolatedValue === 1 ? "transform 0.1s ease-in-out" : "none";
      this.chair.seat.transform.setRotation(this.seated ? -1 : 70);
      this.chair.setPosition(this.seated ? new Vector2(240, 130) : new Vector2(240, 140));
      this.transform.setPosition(this.chair.seat.transform.absolute.position.add(this.data.initialPosition));
      this.transform.setRotation(this.chair.seat.transform.absolute.rotation + this.data.initialRotation);
    }
  }
};

// ts/classes/busywork/screens/main/sections/office/office.ts
var Office = class extends Section {
  constructor(gridParams) {
    super(new Vector2(700, 600), {
      backgroundColor: "#354c59",
      width: "100%",
      height: "600px",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center"
    }, gridParams);
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
    if (Utils.isMobile()) {
      this.dom.style.width = "100%";
      this.dom.style.height = "100%";
    } else {
      this.dom.style.width = "100%";
      this.dom.style.height = "600px";
    }
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
    wrap.append(getDesk(new Vector2(470, 220), 90, 1, {
      filter: "saturate(0.4)"
    }));
    wrap.append(getDesk(new Vector2(-70, 360), 270, 2, {
      filter: "saturate(0.4)"
    }));
    wrap.append(getPlant(new Vector2(30, 30), 0, 6, 80));
    wrap.append(getPlant(new Vector2(590, 30), 40, 7, 50));
    wrap.append(getCoffeeMachine(new Vector2(590, 490), 40, 9, 40));
    wrap.append(new Sitter({ initialPosition: new Vector2(520, 240), hair: "full", initialRotation: 120, armPosition: [0, 0] }));
    wrap.append(new Sitter({ initialPosition: new Vector2(170, 430), hair: "none", initialRotation: -90, armPosition: [1, 0] }));
    this.npc = new Boss(new Vector2(350, 700), 0, "half");
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
      } else {
        this.walker.lookAt(new Vector2(e.offsetX, e.offsetY));
      }
    });
    this.tired = 0.2;
  }
  set tired(value) {
    this._tired = Utils.clamp(value, 0, 1);
    this.overlay.setStyle({
      boxShadow: "inset 0px 0px 290px ".concat(Ease.inOutCubic(this._tired) * 360 - 180, "px  #00000080")
    });
  }
  get tired() {
    return this._tired;
  }
  tick(obj) {
    super.tick(obj);
    this.tired += obj.interval * 3e-6;
    if (obj.frame % 5 === 0) {
      if (this.tired > 0.25) {
        this.setStyle({
          filter: "blur(".concat(Ease.inOutCubic(Math.sin(obj.total * 1e-4 + 0.3) * Math.sin(obj.total * 1e-3 + 0.3) * this.tired) * 2, "px)")
        });
        this.overlay.setStyle({
          backgroundColor: "rgba(0, 0, 0, ".concat(Math.sin(obj.total * 1e-4) * Math.sin(obj.total * 1e-3) * Ease.inOutCubic(this._tired) * 0.3, ")")
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

// ts/classes/busywork/screens/main/util/icon.ts
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

// ts/classes/busywork/screens/main/sections/stat/statbar.ts
var StatBar = class _StatBar extends Section {
  constructor(parent, gridParams) {
    super(new Vector2(700, 1), {
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
      pointerEvents: "none",
      width: "100%",
      height: "100%",
      bottom: "20px"
    }, gridParams);
    this.parent = parent;
    this.stats = [];
    this.addStat(_StatBar.getStatBlock("person_apron", 50), 0, () => {
      return Number(!this.parent.state("bossinroom"));
    });
    this.addStat(_StatBar.getStatBlock("battery_android_frame_bolt", 50), 0, () => {
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
        transition: "margin-top 0.5s ease-in-out, opacity 0.5s ease-in-out, width 0.5s 0.5s ease-in-out",
        position: "relative",
        overflow: "hidden"
      },
      children: [
        new Icon(icon, size)
      ]
    });
  }
  addStat(element, value, getter, setter) {
    this.append(element);
    this.stats.push({
      value,
      element,
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
          // order: index.toString(),
          width: stat.value < 0.5 ? "90px" : "0px",
          transition: stat.value < 0.5 ? "margin-top 0.5s 0.5s ease-in-out, width 0.5s ease-in-out, opacity 0.5s 0.5s ease-in-out" : "margin-top 0.5s ease-in-out, width 0.5s 0.5s ease-in-out, opacity 0.5s ease-in-out"
        });
        stat.element.setStyle({
          marginTop: stat.value < 0.5 ? "0px" : "20px",
          opacity: stat.value < 0.5 ? "1" : "0",
          width: stat.value < 0.5 ? "90px" : "0px"
        });
      });
    }
    ;
  }
};

// ts/classes/busywork/screens/main/sections/coffee/assets.ts
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

// ts/classes/busywork/screens/main/sections/coffee/coffee.ts
var Coffee = class extends Section {
  constructor(parent, gridParams) {
    super(new Vector2(400, 600), {
      backgroundColor: "#354c59",
      boxShadow: "0px 0px 200px #0000004a",
      justifyContent: "flex-start"
    }, gridParams);
    this.parent = parent;
    if (Utils.isMobile()) {
      this.dom.style.width = "450px";
      this.dom.style.height = "100%";
    } else {
      this.dom.style.width = "100%";
      this.dom.style.height = "600px";
    }
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

// ts/classes/busywork/screens/main/sections/debug.ts
var Debug = class extends Section {
  constructor(parent, gridParams) {
    super(new Vector2(700, 20), {
      transition: "width 0.8s ease-in-out, height 0.8s ease-in-out",
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
      width: "100%",
      height: "100%",
      color: "#fff",
      fontFamily: "monospace",
      fontSize: "24px",
      padding: "0 10px"
    }, gridParams);
    this.parent = parent;
  }
};

// ts/classes/element/grid.ts
var Grid = class extends HTML {
  constructor(options) {
    super(__spreadProps(__spreadValues({}, options), { classList: [...options.classList || [], "_grid"] }));
    this.setStyle({
      gridTemplateColumns: options.columns || "1fr",
      gridTemplateRows: options.rows || "1fr",
      gap: "".concat(options.gap, "px"),
      alignContent: options.alignContent || "center",
      alignItems: options.alignItems || "center",
      justifyContent: options.justifyContent || "center",
      justifyItems: options.justifyItems || "center"
    });
    this.setStyle(options.style || {});
  }
  setTemplateColumns(columns) {
    this.setStyle({
      gridTemplateColumns: columns
    });
  }
  setTemplateRows(rows) {
    this.setStyle({
      gridTemplateRows: rows
    });
  }
};

// ts/classes/busywork/screens/main/tilegame.ts
var GridManager = class {
  constructor(grid, columns, rows, gap = 20) {
    this.grid = grid;
    this.gap = gap;
    this.columns = [450, 700, 450];
    this.rows = [0, 350, 230, 50];
    this.columns = columns;
    this.rows = rows;
    this.updateGrid();
  }
  setColumn(index, width) {
    this.columns[index] = width;
  }
  setColumns(columns) {
    this.columns = columns;
  }
  setRow(index, height) {
    this.rows[index] = height;
  }
  setRows(rows) {
    this.rows = rows;
  }
  getColumns() {
    let columns = [];
    let leftColumn = false;
    this.columns.forEach((width, index) => {
      if (index > 0) {
        if (leftColumn && width !== 0) {
          columns.push(this.gap);
        } else {
          columns.push(0);
        }
      }
      if (width !== 0) {
        leftColumn = true;
      }
      columns.push(width);
    });
    return columns;
  }
  getRows() {
    let rows = [];
    let leftRow = false;
    this.rows.forEach((width, index) => {
      if (index > 0) {
        if (leftRow && width !== 0) {
          rows.push(this.gap);
        } else {
          rows.push(0);
        }
      }
      if (width !== 0) {
        leftRow = true;
      }
      rows.push(width);
    });
    return rows;
  }
  getSize() {
    return new Vector2(this.getColumns().reduce((a, b) => a + b, 0), this.getRows().reduce((a, b) => a + b, 0));
  }
  updateGrid() {
    this.grid.setTemplateColumns(this.getColumns().join("px ") + "px");
    this.grid.setTemplateRows(this.getRows().join("px ") + "px");
  }
};
var TileGame = class extends Screen {
  constructor(game) {
    super("test");
    this.game = game;
    this.maxSize = new Vector2(1170, 620);
    this.stateData = {};
    this.append(this.grid = new Grid({
      justifyContent: "center",
      alignItems: "center",
      gap: 0,
      style: {
        width: "".concat(this.maxSize.x, "px"),
        height: "".concat(this.maxSize.y, "px"),
        transition: "grid-template-columns 1s cubic-bezier(0.4, 0, 0.2, 1), grid-template-rows 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)"
      },
      transform: {
        size: this.maxSize,
        anchor: new Vector2(0.5, 0.5)
      }
    }), true);
    if (Utils.isMobile()) {
      this.grid.append(this.debug = new Debug(this, [1, 1, 1, 1]));
      this.grid.append(this.computer = new Computer(this, [1, 1, 3, 1]));
      this.grid.append(this.keyboard = new Keyboard(this, [1, 1, 5, 1]));
      this.grid.append(this.office = new Office([1, 1, 7, 1]), true);
      this.grid.append(this.coffee = new Coffee(this, [1, 1, 11, 1]));
      this.grid.append(this.statBar = new StatBar(this, [1, 1, 9, 1]));
      this.gridManager = new GridManager(this.grid, [700], [0, 350, 230, 600, 1, 600], 20);
    } else {
      this.grid.append(this.coffee = new Coffee(this, [5, 1, 3, 3]));
      this.grid.append(this.computer = new Computer(this, [1, 1, 3, 1]));
      this.grid.append(this.keyboard = new Keyboard(this, [1, 1, 5, 1]));
      this.grid.append(this.debug = new Debug(this, [1, 5, 1, 1]));
      this.grid.append(this.office = new Office([3, 1, 3, 3]), true);
      this.grid.append(this.statBar = new StatBar(this, [3, 1, 7, 1]));
      this.gridManager = new GridManager(this.grid, [450, 700, 450], [0, 350, 230, 1], 20);
    }
    glob.debug = this.debug;
    window.addEventListener("resize", () => {
      this.updateScale();
      glob.mobile = window.innerWidth < window.innerHeight;
    });
    this.updateScale();
    this.addState(
      "atdesk",
      false,
      () => {
        return this.office.walker.transform.position.distance(new Vector2(280, 165)) < 60 && (!this.office.walker.destination || this.office.walker.destination.distance(new Vector2(280, 165)) < 60);
      },
      (value) => {
        this.updateGridSize();
        this.office.sitter.seated = value;
        this.office.walker.visible = !value;
        if (value) {
          this.office.walker.setDestination(void 0);
          this.office.walker.transform.setPosition(new Vector2(280, 160));
        }
      }
    );
    this.addState(
      "atcoffeemachine",
      false,
      () => {
        this.updateGridSize();
        return this.office.walker.transform.position.distance(new Vector2(650, 550)) < 200 && (!this.office.walker.destination || this.office.walker.destination.distance(new Vector2(700, 600)) < 200);
      }
    );
    this.addState(
      "bossinroom",
      false,
      () => {
        return this.office.npc.phase > 0 && this.office.npc.phase < 4;
      }
    );
    this.addState(
      "bosslooking",
      false,
      () => {
        return this.office.npc.phase > 2 && this.office.npc.phase < 4;
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
  state(state) {
    var _a;
    return (_a = this.stateData[state]) == null ? void 0 : _a.value;
  }
  updateGridSize() {
    if (Utils.isMobile()) {
      this.gridManager.setColumn(0, this.state("atdesk") || this.state("atcoffeemachine") ? 450 : 700);
      this.gridManager.setRow(1, this.state("atdesk") ? 350 : 0);
      this.gridManager.setRow(2, this.state("atdesk") ? 230 : 0);
      this.gridManager.setRow(3, this.state("atdesk") || this.state("atcoffeemachine") ? 500 : 600);
      this.gridManager.setRow(5, this.state("atcoffeemachine") ? 600 : 0);
      this.gridManager.updateGrid();
    } else {
      this.gridManager.setColumn(0, this.state("atdesk") ? 450 : 0);
      this.gridManager.setColumn(1, 680);
      this.gridManager.setColumn(2, this.state("atcoffeemachine") ? 400 : 0);
      this.gridManager.updateGrid();
    }
    this.updateScale(this.gridManager.getSize().add(new Vector2(40, 40)));
  }
  updateScale(size = this.maxSize) {
    const windowSize = new Vector2(window.innerWidth, window.innerHeight);
    const xf = windowSize.x / size.x;
    const yf = windowSize.y / size.y;
    this.grid.transform.setScale(new Vector2(Math.min(xf, yf), Math.min(xf, yf)));
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
    super.tick(obj);
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
    row2.append(new Button({ text: "Click me", style: { backgroundColor: "#2198c9", color: "white", borderRadius: "5px" }, onMouseDown: () => {
      this.game.start();
    } }));
  }
};

// ts/game.ts
var Busywork = class extends Game2 {
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
  if (location.hostname !== "localhost") {
    const base = document.createElement("base");
    base.href = "https://basamols.github.io/busywork/dist/";
    document.head.appendChild(base);
  }
  const g = new Busywork();
  g.run();
  document.body.appendChild(g.dom);
  window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };
});
//# sourceMappingURL=index.js.map
