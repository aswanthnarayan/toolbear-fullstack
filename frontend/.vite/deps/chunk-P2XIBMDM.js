import {
  __rest,
  init_tslib_es6
} from "./chunk-JCH7QQEQ.js";
import {
  __esm,
  __export
} from "./chunk-EWTE5DHJ.js";

// node_modules/hey-listen/dist/hey-listen.es.js
var hey_listen_es_exports = {};
__export(hey_listen_es_exports, {
  invariant: () => invariant,
  warning: () => warning
});
var warning, invariant;
var init_hey_listen_es = __esm({
  "node_modules/hey-listen/dist/hey-listen.es.js"() {
    warning = function() {
    };
    invariant = function() {
    };
    if (true) {
      warning = function(check, message) {
        if (!check && typeof console !== "undefined") {
          console.warn(message);
        }
      };
      invariant = function(check, message) {
        if (!check) {
          throw new Error(message);
        }
      };
    }
  }
});

// node_modules/@motionone/dom/dist/utils/resolve-elements.es.js
function resolveElements(elements, selectorCache) {
  var _a;
  if (typeof elements === "string") {
    if (selectorCache) {
      (_a = selectorCache[elements]) !== null && _a !== void 0 ? _a : selectorCache[elements] = document.querySelectorAll(elements);
      elements = selectorCache[elements];
    } else {
      elements = document.querySelectorAll(elements);
    }
  } else if (elements instanceof Element) {
    elements = [elements];
  }
  return Array.from(elements || []);
}
var init_resolve_elements_es = __esm({
  "node_modules/@motionone/dom/dist/utils/resolve-elements.es.js"() {
  }
});

// node_modules/@motionone/dom/dist/gestures/in-view.es.js
function inView(elementOrSelector, onStart, { root, margin: rootMargin, amount = "any" } = {}) {
  if (typeof IntersectionObserver === "undefined") {
    return () => {
    };
  }
  const elements = resolveElements(elementOrSelector);
  const activeIntersections = /* @__PURE__ */ new WeakMap();
  const onIntersectionChange = (entries) => {
    entries.forEach((entry) => {
      const onEnd = activeIntersections.get(entry.target);
      if (entry.isIntersecting === Boolean(onEnd))
        return;
      if (entry.isIntersecting) {
        const newOnEnd = onStart(entry);
        if (typeof newOnEnd === "function") {
          activeIntersections.set(entry.target, newOnEnd);
        } else {
          observer2.unobserve(entry.target);
        }
      } else if (onEnd) {
        onEnd(entry);
        activeIntersections.delete(entry.target);
      }
    });
  };
  const observer2 = new IntersectionObserver(onIntersectionChange, {
    root,
    rootMargin,
    threshold: typeof amount === "number" ? amount : thresholds[amount]
  });
  elements.forEach((element) => observer2.observe(element));
  return () => observer2.disconnect();
}
var thresholds;
var init_in_view_es = __esm({
  "node_modules/@motionone/dom/dist/gestures/in-view.es.js"() {
    init_resolve_elements_es();
    thresholds = {
      any: 0,
      all: 1
    };
  }
});

// node_modules/@motionone/dom/dist/gestures/resize/handle-element.es.js
function getElementSize(target, borderBoxSize) {
  if (borderBoxSize) {
    const { inlineSize, blockSize } = borderBoxSize[0];
    return { width: inlineSize, height: blockSize };
  } else if (target instanceof SVGElement && "getBBox" in target) {
    return target.getBBox();
  } else {
    return {
      width: target.offsetWidth,
      height: target.offsetHeight
    };
  }
}
function notifyTarget({ target, contentRect, borderBoxSize }) {
  var _a;
  (_a = resizeHandlers.get(target)) === null || _a === void 0 ? void 0 : _a.forEach((handler) => {
    handler({
      target,
      contentSize: contentRect,
      get size() {
        return getElementSize(target, borderBoxSize);
      }
    });
  });
}
function notifyAll(entries) {
  entries.forEach(notifyTarget);
}
function createResizeObserver() {
  if (typeof ResizeObserver === "undefined")
    return;
  observer = new ResizeObserver(notifyAll);
}
function resizeElement(target, handler) {
  if (!observer)
    createResizeObserver();
  const elements = resolveElements(target);
  elements.forEach((element) => {
    let elementHandlers = resizeHandlers.get(element);
    if (!elementHandlers) {
      elementHandlers = /* @__PURE__ */ new Set();
      resizeHandlers.set(element, elementHandlers);
    }
    elementHandlers.add(handler);
    observer === null || observer === void 0 ? void 0 : observer.observe(element);
  });
  return () => {
    elements.forEach((element) => {
      const elementHandlers = resizeHandlers.get(element);
      elementHandlers === null || elementHandlers === void 0 ? void 0 : elementHandlers.delete(handler);
      if (!(elementHandlers === null || elementHandlers === void 0 ? void 0 : elementHandlers.size)) {
        observer === null || observer === void 0 ? void 0 : observer.unobserve(element);
      }
    });
  };
}
var resizeHandlers, observer;
var init_handle_element_es = __esm({
  "node_modules/@motionone/dom/dist/gestures/resize/handle-element.es.js"() {
    init_resolve_elements_es();
    resizeHandlers = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/@motionone/dom/dist/gestures/resize/handle-window.es.js
function createWindowResizeHandler() {
  windowResizeHandler = () => {
    const size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    const info = {
      target: window,
      size,
      contentSize: size
    };
    windowCallbacks.forEach((callback) => callback(info));
  };
  window.addEventListener("resize", windowResizeHandler);
}
function resizeWindow(callback) {
  windowCallbacks.add(callback);
  if (!windowResizeHandler)
    createWindowResizeHandler();
  return () => {
    windowCallbacks.delete(callback);
    if (!windowCallbacks.size && windowResizeHandler) {
      windowResizeHandler = void 0;
    }
  };
}
var windowCallbacks, windowResizeHandler;
var init_handle_window_es = __esm({
  "node_modules/@motionone/dom/dist/gestures/resize/handle-window.es.js"() {
    windowCallbacks = /* @__PURE__ */ new Set();
  }
});

// node_modules/@motionone/dom/dist/gestures/resize/index.es.js
function resize(a, b) {
  return typeof a === "function" ? resizeWindow(a) : resizeElement(a, b);
}
var init_index_es = __esm({
  "node_modules/@motionone/dom/dist/gestures/resize/index.es.js"() {
    init_handle_element_es();
    init_handle_window_es();
  }
});

// node_modules/@motionone/utils/dist/array.es.js
function addUniqueItem(array, item) {
  array.indexOf(item) === -1 && array.push(item);
}
function removeItem(arr, item) {
  const index2 = arr.indexOf(item);
  index2 > -1 && arr.splice(index2, 1);
}
var init_array_es = __esm({
  "node_modules/@motionone/utils/dist/array.es.js"() {
  }
});

// node_modules/@motionone/utils/dist/clamp.es.js
var clamp;
var init_clamp_es = __esm({
  "node_modules/@motionone/utils/dist/clamp.es.js"() {
    clamp = (min, max, v) => Math.min(Math.max(v, min), max);
  }
});

// node_modules/@motionone/utils/dist/defaults.es.js
var defaults;
var init_defaults_es = __esm({
  "node_modules/@motionone/utils/dist/defaults.es.js"() {
    defaults = {
      duration: 0.3,
      delay: 0,
      endDelay: 0,
      repeat: 0,
      easing: "ease"
    };
  }
});

// node_modules/@motionone/utils/dist/is-number.es.js
var isNumber;
var init_is_number_es = __esm({
  "node_modules/@motionone/utils/dist/is-number.es.js"() {
    isNumber = (value) => typeof value === "number";
  }
});

// node_modules/@motionone/utils/dist/is-easing-list.es.js
var isEasingList;
var init_is_easing_list_es = __esm({
  "node_modules/@motionone/utils/dist/is-easing-list.es.js"() {
    init_is_number_es();
    isEasingList = (easing) => Array.isArray(easing) && !isNumber(easing[0]);
  }
});

// node_modules/@motionone/utils/dist/wrap.es.js
var wrap;
var init_wrap_es = __esm({
  "node_modules/@motionone/utils/dist/wrap.es.js"() {
    wrap = (min, max, v) => {
      const rangeSize = max - min;
      return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
    };
  }
});

// node_modules/@motionone/utils/dist/easing.es.js
function getEasingForSegment(easing, i) {
  return isEasingList(easing) ? easing[wrap(0, easing.length, i)] : easing;
}
var init_easing_es = __esm({
  "node_modules/@motionone/utils/dist/easing.es.js"() {
    init_is_easing_list_es();
    init_wrap_es();
  }
});

// node_modules/@motionone/utils/dist/mix.es.js
var mix;
var init_mix_es = __esm({
  "node_modules/@motionone/utils/dist/mix.es.js"() {
    mix = (min, max, progress2) => -progress2 * min + progress2 * max + min;
  }
});

// node_modules/@motionone/utils/dist/noop.es.js
var noop, noopReturn;
var init_noop_es = __esm({
  "node_modules/@motionone/utils/dist/noop.es.js"() {
    noop = () => {
    };
    noopReturn = (v) => v;
  }
});

// node_modules/@motionone/utils/dist/progress.es.js
var progress;
var init_progress_es = __esm({
  "node_modules/@motionone/utils/dist/progress.es.js"() {
    progress = (min, max, value) => max - min === 0 ? 1 : (value - min) / (max - min);
  }
});

// node_modules/@motionone/utils/dist/offset.es.js
function fillOffset(offset, remaining) {
  const min = offset[offset.length - 1];
  for (let i = 1; i <= remaining; i++) {
    const offsetProgress = progress(0, remaining, i);
    offset.push(mix(min, 1, offsetProgress));
  }
}
function defaultOffset(length2) {
  const offset = [0];
  fillOffset(offset, length2 - 1);
  return offset;
}
var init_offset_es = __esm({
  "node_modules/@motionone/utils/dist/offset.es.js"() {
    init_mix_es();
    init_progress_es();
  }
});

// node_modules/@motionone/utils/dist/interpolate.es.js
function interpolate(output, input = defaultOffset(output.length), easing = noopReturn) {
  const length2 = output.length;
  const remainder = length2 - input.length;
  remainder > 0 && fillOffset(input, remainder);
  return (t) => {
    let i = 0;
    for (; i < length2 - 2; i++) {
      if (t < input[i + 1])
        break;
    }
    let progressInRange = clamp(0, 1, progress(input[i], input[i + 1], t));
    const segmentEasing = getEasingForSegment(easing, i);
    progressInRange = segmentEasing(progressInRange);
    return mix(output[i], output[i + 1], progressInRange);
  };
}
var init_interpolate_es = __esm({
  "node_modules/@motionone/utils/dist/interpolate.es.js"() {
    init_mix_es();
    init_noop_es();
    init_offset_es();
    init_progress_es();
    init_easing_es();
    init_clamp_es();
  }
});

// node_modules/@motionone/utils/dist/is-cubic-bezier.es.js
var isCubicBezier;
var init_is_cubic_bezier_es = __esm({
  "node_modules/@motionone/utils/dist/is-cubic-bezier.es.js"() {
    init_is_number_es();
    isCubicBezier = (easing) => Array.isArray(easing) && isNumber(easing[0]);
  }
});

// node_modules/@motionone/utils/dist/is-easing-generator.es.js
var isEasingGenerator;
var init_is_easing_generator_es = __esm({
  "node_modules/@motionone/utils/dist/is-easing-generator.es.js"() {
    isEasingGenerator = (easing) => typeof easing === "object" && Boolean(easing.createAnimation);
  }
});

// node_modules/@motionone/utils/dist/is-function.es.js
var isFunction;
var init_is_function_es = __esm({
  "node_modules/@motionone/utils/dist/is-function.es.js"() {
    isFunction = (value) => typeof value === "function";
  }
});

// node_modules/@motionone/utils/dist/is-string.es.js
var isString;
var init_is_string_es = __esm({
  "node_modules/@motionone/utils/dist/is-string.es.js"() {
    isString = (value) => typeof value === "string";
  }
});

// node_modules/@motionone/utils/dist/time.es.js
var time;
var init_time_es = __esm({
  "node_modules/@motionone/utils/dist/time.es.js"() {
    time = {
      ms: (seconds) => seconds * 1e3,
      s: (milliseconds) => milliseconds / 1e3
    };
  }
});

// node_modules/@motionone/utils/dist/velocity.es.js
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}
var init_velocity_es = __esm({
  "node_modules/@motionone/utils/dist/velocity.es.js"() {
  }
});

// node_modules/@motionone/utils/dist/index.es.js
var init_index_es2 = __esm({
  "node_modules/@motionone/utils/dist/index.es.js"() {
    init_array_es();
    init_clamp_es();
    init_defaults_es();
    init_easing_es();
    init_interpolate_es();
    init_is_cubic_bezier_es();
    init_is_easing_generator_es();
    init_is_easing_list_es();
    init_is_function_es();
    init_is_number_es();
    init_is_string_es();
    init_mix_es();
    init_noop_es();
    init_offset_es();
    init_progress_es();
    init_time_es();
    init_velocity_es();
    init_wrap_es();
  }
});

// node_modules/@motionone/dom/dist/gestures/scroll/info.es.js
function updateAxisInfo(element, axisName, info, time2) {
  const axis = info[axisName];
  const { length: length2, position } = keys[axisName];
  const prev = axis.current;
  const prevTime = info.time;
  axis.current = element["scroll" + position];
  axis.scrollLength = element["scroll" + length2] - element["client" + length2];
  axis.offset.length = 0;
  axis.offset[0] = 0;
  axis.offset[1] = axis.scrollLength;
  axis.progress = progress(0, axis.scrollLength, axis.current);
  const elapsed = time2 - prevTime;
  axis.velocity = elapsed > maxElapsed ? 0 : velocityPerSecond(axis.current - prev, elapsed);
}
function updateScrollInfo(element, info, time2) {
  updateAxisInfo(element, "x", info, time2);
  updateAxisInfo(element, "y", info, time2);
  info.time = time2;
}
var maxElapsed, createAxisInfo, createScrollInfo, keys;
var init_info_es = __esm({
  "node_modules/@motionone/dom/dist/gestures/scroll/info.es.js"() {
    init_index_es2();
    maxElapsed = 50;
    createAxisInfo = () => ({
      current: 0,
      offset: [],
      progress: 0,
      scrollLength: 0,
      targetOffset: 0,
      targetLength: 0,
      containerLength: 0,
      velocity: 0
    });
    createScrollInfo = () => ({
      time: 0,
      x: createAxisInfo(),
      y: createAxisInfo()
    });
    keys = {
      x: {
        length: "Width",
        position: "Left"
      },
      y: {
        length: "Height",
        position: "Top"
      }
    };
  }
});

// node_modules/@motionone/dom/dist/gestures/scroll/offsets/inset.es.js
function calcInset(element, container) {
  let inset = { x: 0, y: 0 };
  let current = element;
  while (current && current !== container) {
    if (current instanceof HTMLElement) {
      inset.x += current.offsetLeft;
      inset.y += current.offsetTop;
      current = current.offsetParent;
    } else if (current instanceof SVGGraphicsElement && "getBBox" in current) {
      const { top, left } = current.getBBox();
      inset.x += left;
      inset.y += top;
      while (current && current.tagName !== "svg") {
        current = current.parentNode;
      }
    }
  }
  return inset;
}
var init_inset_es = __esm({
  "node_modules/@motionone/dom/dist/gestures/scroll/offsets/inset.es.js"() {
  }
});

// node_modules/@motionone/dom/dist/gestures/scroll/offsets/presets.es.js
var ScrollOffset;
var init_presets_es = __esm({
  "node_modules/@motionone/dom/dist/gestures/scroll/offsets/presets.es.js"() {
    ScrollOffset = {
      Enter: [
        [0, 1],
        [1, 1]
      ],
      Exit: [
        [0, 0],
        [1, 0]
      ],
      Any: [
        [1, 0],
        [0, 1]
      ],
      All: [
        [0, 0],
        [1, 1]
      ]
    };
  }
});

// node_modules/@motionone/dom/dist/gestures/scroll/offsets/edge.es.js
function resolveEdge(edge, length2, inset = 0) {
  let delta = 0;
  if (namedEdges[edge] !== void 0) {
    edge = namedEdges[edge];
  }
  if (isString(edge)) {
    const asNumber = parseFloat(edge);
    if (edge.endsWith("px")) {
      delta = asNumber;
    } else if (edge.endsWith("%")) {
      edge = asNumber / 100;
    } else if (edge.endsWith("vw")) {
      delta = asNumber / 100 * document.documentElement.clientWidth;
    } else if (edge.endsWith("vh")) {
      delta = asNumber / 100 * document.documentElement.clientHeight;
    } else {
      edge = asNumber;
    }
  }
  if (isNumber(edge)) {
    delta = length2 * edge;
  }
  return inset + delta;
}
var namedEdges;
var init_edge_es = __esm({
  "node_modules/@motionone/dom/dist/gestures/scroll/offsets/edge.es.js"() {
    init_index_es2();
    namedEdges = {
      start: 0,
      center: 0.5,
      end: 1
    };
  }
});

// node_modules/@motionone/dom/dist/gestures/scroll/offsets/offset.es.js
function resolveOffset(offset, containerLength, targetLength, targetInset) {
  let offsetDefinition = Array.isArray(offset) ? offset : defaultOffset2;
  let targetPoint = 0;
  let containerPoint = 0;
  if (isNumber(offset)) {
    offsetDefinition = [offset, offset];
  } else if (isString(offset)) {
    offset = offset.trim();
    if (offset.includes(" ")) {
      offsetDefinition = offset.split(" ");
    } else {
      offsetDefinition = [offset, namedEdges[offset] ? offset : `0`];
    }
  }
  targetPoint = resolveEdge(offsetDefinition[0], targetLength, targetInset);
  containerPoint = resolveEdge(offsetDefinition[1], containerLength);
  return targetPoint - containerPoint;
}
var defaultOffset2;
var init_offset_es2 = __esm({
  "node_modules/@motionone/dom/dist/gestures/scroll/offsets/offset.es.js"() {
    init_index_es2();
    init_edge_es();
    defaultOffset2 = [0, 0];
  }
});

// node_modules/@motionone/dom/dist/gestures/scroll/offsets/index.es.js
function resolveOffsets(container, info, options) {
  let { offset: offsetDefinition = ScrollOffset.All } = options;
  const { target = container, axis = "y" } = options;
  const lengthLabel = axis === "y" ? "height" : "width";
  const inset = target !== container ? calcInset(target, container) : point;
  const targetSize = target === container ? { width: container.scrollWidth, height: container.scrollHeight } : { width: target.clientWidth, height: target.clientHeight };
  const containerSize = {
    width: container.clientWidth,
    height: container.clientHeight
  };
  info[axis].offset.length = 0;
  let hasChanged2 = !info[axis].interpolate;
  const numOffsets = offsetDefinition.length;
  for (let i = 0; i < numOffsets; i++) {
    const offset = resolveOffset(offsetDefinition[i], containerSize[lengthLabel], targetSize[lengthLabel], inset[axis]);
    if (!hasChanged2 && offset !== info[axis].interpolatorOffsets[i]) {
      hasChanged2 = true;
    }
    info[axis].offset[i] = offset;
  }
  if (hasChanged2) {
    info[axis].interpolate = interpolate(defaultOffset(numOffsets), info[axis].offset);
    info[axis].interpolatorOffsets = [...info[axis].offset];
  }
  info[axis].progress = info[axis].interpolate(info[axis].current);
}
var point;
var init_index_es3 = __esm({
  "node_modules/@motionone/dom/dist/gestures/scroll/offsets/index.es.js"() {
    init_index_es2();
    init_inset_es();
    init_presets_es();
    init_offset_es2();
    point = { x: 0, y: 0 };
  }
});

// node_modules/@motionone/dom/dist/gestures/scroll/on-scroll-handler.es.js
function measure(container, target = container, info) {
  info.x.targetOffset = 0;
  info.y.targetOffset = 0;
  if (target !== container) {
    let node = target;
    while (node && node != container) {
      info.x.targetOffset += node.offsetLeft;
      info.y.targetOffset += node.offsetTop;
      node = node.offsetParent;
    }
  }
  info.x.targetLength = target === container ? target.scrollWidth : target.clientWidth;
  info.y.targetLength = target === container ? target.scrollHeight : target.clientHeight;
  info.x.containerLength = container.clientWidth;
  info.y.containerLength = container.clientHeight;
}
function createOnScrollHandler(element, onScroll, info, options = {}) {
  const axis = options.axis || "y";
  return {
    measure: () => measure(element, options.target, info),
    update: (time2) => {
      updateScrollInfo(element, info, time2);
      if (options.offset || options.target) {
        resolveOffsets(element, info, options);
      }
    },
    notify: typeof onScroll === "function" ? () => onScroll(info) : scrubAnimation(onScroll, info[axis])
  };
}
function scrubAnimation(controls2, axisInfo) {
  controls2.pause();
  controls2.forEachNative((animation, { easing }) => {
    var _a, _b;
    if (animation.updateDuration) {
      if (!easing)
        animation.easing = noopReturn;
      animation.updateDuration(1);
    } else {
      const timingOptions = { duration: 1e3 };
      if (!easing)
        timingOptions.easing = "linear";
      (_b = (_a = animation.effect) === null || _a === void 0 ? void 0 : _a.updateTiming) === null || _b === void 0 ? void 0 : _b.call(_a, timingOptions);
    }
  });
  return () => {
    controls2.currentTime = axisInfo.progress;
  };
}
var init_on_scroll_handler_es = __esm({
  "node_modules/@motionone/dom/dist/gestures/scroll/on-scroll-handler.es.js"() {
    init_index_es2();
    init_info_es();
    init_index_es3();
  }
});

// node_modules/@motionone/dom/dist/gestures/scroll/index.es.js
function scroll(onScroll, _a = {}) {
  var { container = document.documentElement } = _a, options = __rest(_a, ["container"]);
  let containerHandlers = onScrollHandlers.get(container);
  if (!containerHandlers) {
    containerHandlers = /* @__PURE__ */ new Set();
    onScrollHandlers.set(container, containerHandlers);
  }
  const info = createScrollInfo();
  const containerHandler = createOnScrollHandler(container, onScroll, info, options);
  containerHandlers.add(containerHandler);
  if (!scrollListeners.has(container)) {
    const listener2 = () => {
      const time2 = performance.now();
      for (const handler of containerHandlers)
        handler.measure();
      for (const handler of containerHandlers)
        handler.update(time2);
      for (const handler of containerHandlers)
        handler.notify();
    };
    scrollListeners.set(container, listener2);
    const target = getEventTarget(container);
    window.addEventListener("resize", listener2, { passive: true });
    if (container !== document.documentElement) {
      resizeListeners.set(container, resize(container, listener2));
    }
    target.addEventListener("scroll", listener2, { passive: true });
  }
  const listener = scrollListeners.get(container);
  const onLoadProcesss = requestAnimationFrame(listener);
  return () => {
    var _a2;
    if (typeof onScroll !== "function")
      onScroll.stop();
    cancelAnimationFrame(onLoadProcesss);
    const containerHandlers2 = onScrollHandlers.get(container);
    if (!containerHandlers2)
      return;
    containerHandlers2.delete(containerHandler);
    if (containerHandlers2.size)
      return;
    const listener2 = scrollListeners.get(container);
    scrollListeners.delete(container);
    if (listener2) {
      getEventTarget(container).removeEventListener("scroll", listener2);
      (_a2 = resizeListeners.get(container)) === null || _a2 === void 0 ? void 0 : _a2();
      window.removeEventListener("resize", listener2);
    }
  };
}
var scrollListeners, resizeListeners, onScrollHandlers, getEventTarget;
var init_index_es4 = __esm({
  "node_modules/@motionone/dom/dist/gestures/scroll/index.es.js"() {
    init_tslib_es6();
    init_index_es();
    init_info_es();
    init_on_scroll_handler_es();
    scrollListeners = /* @__PURE__ */ new WeakMap();
    resizeListeners = /* @__PURE__ */ new WeakMap();
    onScrollHandlers = /* @__PURE__ */ new WeakMap();
    getEventTarget = (element) => element === document.documentElement ? window : element;
  }
});

// node_modules/@motionone/types/dist/MotionValue.es.js
var MotionValue;
var init_MotionValue_es = __esm({
  "node_modules/@motionone/types/dist/MotionValue.es.js"() {
    MotionValue = class {
      setAnimation(animation) {
        this.animation = animation;
        animation === null || animation === void 0 ? void 0 : animation.finished.then(() => this.clearAnimation()).catch(() => {
        });
      }
      clearAnimation() {
        this.animation = this.generator = void 0;
      }
    };
  }
});

// node_modules/@motionone/types/dist/index.es.js
var init_index_es5 = __esm({
  "node_modules/@motionone/types/dist/index.es.js"() {
    init_MotionValue_es();
  }
});

// node_modules/@motionone/dom/dist/animate/data.es.js
function getAnimationData(element) {
  if (!data.has(element)) {
    data.set(element, {
      transforms: [],
      values: /* @__PURE__ */ new Map()
    });
  }
  return data.get(element);
}
function getMotionValue(motionValues, name) {
  if (!motionValues.has(name)) {
    motionValues.set(name, new MotionValue());
  }
  return motionValues.get(name);
}
var data;
var init_data_es = __esm({
  "node_modules/@motionone/dom/dist/animate/data.es.js"() {
    init_index_es5();
    data = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/@motionone/dom/dist/animate/utils/transforms.es.js
var axes, order, transformAlias, rotation, baseTransformProperties, transformDefinitions, asTransformCssVar, transforms, compareTransformOrder, transformLookup, isTransform, addTransformToElement, buildTransformTemplate, transformListToString;
var init_transforms_es = __esm({
  "node_modules/@motionone/dom/dist/animate/utils/transforms.es.js"() {
    init_index_es2();
    init_data_es();
    axes = ["", "X", "Y", "Z"];
    order = ["translate", "scale", "rotate", "skew"];
    transformAlias = {
      x: "translateX",
      y: "translateY",
      z: "translateZ"
    };
    rotation = {
      syntax: "<angle>",
      initialValue: "0deg",
      toDefaultUnit: (v) => v + "deg"
    };
    baseTransformProperties = {
      translate: {
        syntax: "<length-percentage>",
        initialValue: "0px",
        toDefaultUnit: (v) => v + "px"
      },
      rotate: rotation,
      scale: {
        syntax: "<number>",
        initialValue: 1,
        toDefaultUnit: noopReturn
      },
      skew: rotation
    };
    transformDefinitions = /* @__PURE__ */ new Map();
    asTransformCssVar = (name) => `--motion-${name}`;
    transforms = ["x", "y", "z"];
    order.forEach((name) => {
      axes.forEach((axis) => {
        transforms.push(name + axis);
        transformDefinitions.set(asTransformCssVar(name + axis), baseTransformProperties[name]);
      });
    });
    compareTransformOrder = (a, b) => transforms.indexOf(a) - transforms.indexOf(b);
    transformLookup = new Set(transforms);
    isTransform = (name) => transformLookup.has(name);
    addTransformToElement = (element, name) => {
      if (transformAlias[name])
        name = transformAlias[name];
      const { transforms: transforms2 } = getAnimationData(element);
      addUniqueItem(transforms2, name);
      element.style.transform = buildTransformTemplate(transforms2);
    };
    buildTransformTemplate = (transforms2) => transforms2.sort(compareTransformOrder).reduce(transformListToString, "").trim();
    transformListToString = (template, name) => `${template} ${name}(var(${asTransformCssVar(name)}))`;
  }
});

// node_modules/@motionone/dom/dist/animate/utils/css-var.es.js
function registerCssVariable(name) {
  if (registeredProperties.has(name))
    return;
  registeredProperties.add(name);
  try {
    const { syntax, initialValue } = transformDefinitions.has(name) ? transformDefinitions.get(name) : {};
    CSS.registerProperty({
      name,
      inherits: false,
      syntax,
      initialValue
    });
  } catch (e) {
  }
}
var isCssVar, registeredProperties;
var init_css_var_es = __esm({
  "node_modules/@motionone/dom/dist/animate/utils/css-var.es.js"() {
    init_transforms_es();
    isCssVar = (name) => name.startsWith("--");
    registeredProperties = /* @__PURE__ */ new Set();
  }
});

// node_modules/@motionone/easing/dist/cubic-bezier.es.js
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = lowerBound + (upperBound - lowerBound) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - x;
    if (currentX > 0) {
      upperBound = currentT;
    } else {
      lowerBound = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return noopReturn;
  const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
  return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
var calcBezier, subdivisionPrecision, subdivisionMaxIterations;
var init_cubic_bezier_es = __esm({
  "node_modules/@motionone/easing/dist/cubic-bezier.es.js"() {
    init_index_es2();
    calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
    subdivisionPrecision = 1e-7;
    subdivisionMaxIterations = 12;
  }
});

// node_modules/@motionone/easing/dist/steps.es.js
var steps;
var init_steps_es = __esm({
  "node_modules/@motionone/easing/dist/steps.es.js"() {
    init_index_es2();
    steps = (steps2, direction = "end") => (progress2) => {
      progress2 = direction === "end" ? Math.min(progress2, 0.999) : Math.max(progress2, 1e-3);
      const expanded = progress2 * steps2;
      const rounded = direction === "end" ? Math.floor(expanded) : Math.ceil(expanded);
      return clamp(0, 1, rounded / steps2);
    };
  }
});

// node_modules/@motionone/easing/dist/index.es.js
var init_index_es6 = __esm({
  "node_modules/@motionone/easing/dist/index.es.js"() {
    init_cubic_bezier_es();
    init_steps_es();
  }
});

// node_modules/@motionone/animation/dist/utils/easing.es.js
function getEasingFunction(definition) {
  if (isFunction(definition))
    return definition;
  if (isCubicBezier(definition))
    return cubicBezier(...definition);
  const namedEasing = namedEasings[definition];
  if (namedEasing)
    return namedEasing;
  if (definition.startsWith("steps")) {
    const args = functionArgsRegex.exec(definition);
    if (args) {
      const argsArray = args[1].split(",");
      return steps(parseFloat(argsArray[0]), argsArray[1].trim());
    }
  }
  return noopReturn;
}
var namedEasings, functionArgsRegex;
var init_easing_es2 = __esm({
  "node_modules/@motionone/animation/dist/utils/easing.es.js"() {
    init_index_es6();
    init_index_es2();
    namedEasings = {
      ease: cubicBezier(0.25, 0.1, 0.25, 1),
      "ease-in": cubicBezier(0.42, 0, 1, 1),
      "ease-in-out": cubicBezier(0.42, 0, 0.58, 1),
      "ease-out": cubicBezier(0, 0, 0.58, 1)
    };
    functionArgsRegex = /\((.*?)\)/;
  }
});

// node_modules/@motionone/animation/dist/Animation.es.js
var Animation;
var init_Animation_es = __esm({
  "node_modules/@motionone/animation/dist/Animation.es.js"() {
    init_index_es2();
    init_easing_es2();
    Animation = class {
      constructor(output, keyframes = [0, 1], { easing, duration: initialDuration = defaults.duration, delay = defaults.delay, endDelay = defaults.endDelay, repeat = defaults.repeat, offset, direction = "normal", autoplay = true } = {}) {
        this.startTime = null;
        this.rate = 1;
        this.t = 0;
        this.cancelTimestamp = null;
        this.easing = noopReturn;
        this.duration = 0;
        this.totalDuration = 0;
        this.repeat = 0;
        this.playState = "idle";
        this.finished = new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
        easing = easing || defaults.easing;
        if (isEasingGenerator(easing)) {
          const custom = easing.createAnimation(keyframes);
          easing = custom.easing;
          keyframes = custom.keyframes || keyframes;
          initialDuration = custom.duration || initialDuration;
        }
        this.repeat = repeat;
        this.easing = isEasingList(easing) ? noopReturn : getEasingFunction(easing);
        this.updateDuration(initialDuration);
        const interpolate$1 = interpolate(keyframes, offset, isEasingList(easing) ? easing.map(getEasingFunction) : noopReturn);
        this.tick = (timestamp) => {
          var _a;
          delay = delay;
          let t = 0;
          if (this.pauseTime !== void 0) {
            t = this.pauseTime;
          } else {
            t = (timestamp - this.startTime) * this.rate;
          }
          this.t = t;
          t /= 1e3;
          t = Math.max(t - delay, 0);
          if (this.playState === "finished" && this.pauseTime === void 0) {
            t = this.totalDuration;
          }
          const progress2 = t / this.duration;
          let currentIteration = Math.floor(progress2);
          let iterationProgress = progress2 % 1;
          if (!iterationProgress && progress2 >= 1) {
            iterationProgress = 1;
          }
          iterationProgress === 1 && currentIteration--;
          const iterationIsOdd = currentIteration % 2;
          if (direction === "reverse" || direction === "alternate" && iterationIsOdd || direction === "alternate-reverse" && !iterationIsOdd) {
            iterationProgress = 1 - iterationProgress;
          }
          const p = t >= this.totalDuration ? 1 : Math.min(iterationProgress, 1);
          const latest = interpolate$1(this.easing(p));
          output(latest);
          const isAnimationFinished = this.pauseTime === void 0 && (this.playState === "finished" || t >= this.totalDuration + endDelay);
          if (isAnimationFinished) {
            this.playState = "finished";
            (_a = this.resolve) === null || _a === void 0 ? void 0 : _a.call(this, latest);
          } else if (this.playState !== "idle") {
            this.frameRequestId = requestAnimationFrame(this.tick);
          }
        };
        if (autoplay)
          this.play();
      }
      play() {
        const now = performance.now();
        this.playState = "running";
        if (this.pauseTime !== void 0) {
          this.startTime = now - this.pauseTime;
        } else if (!this.startTime) {
          this.startTime = now;
        }
        this.cancelTimestamp = this.startTime;
        this.pauseTime = void 0;
        this.frameRequestId = requestAnimationFrame(this.tick);
      }
      pause() {
        this.playState = "paused";
        this.pauseTime = this.t;
      }
      finish() {
        this.playState = "finished";
        this.tick(0);
      }
      stop() {
        var _a;
        this.playState = "idle";
        if (this.frameRequestId !== void 0) {
          cancelAnimationFrame(this.frameRequestId);
        }
        (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, false);
      }
      cancel() {
        this.stop();
        this.tick(this.cancelTimestamp);
      }
      reverse() {
        this.rate *= -1;
      }
      commitStyles() {
      }
      updateDuration(duration) {
        this.duration = duration;
        this.totalDuration = duration * (this.repeat + 1);
      }
      get currentTime() {
        return this.t;
      }
      set currentTime(t) {
        if (this.pauseTime !== void 0 || this.rate === 0) {
          this.pauseTime = t;
        } else {
          this.startTime = performance.now() - t / this.rate;
        }
      }
      get playbackRate() {
        return this.rate;
      }
      set playbackRate(rate) {
        this.rate = rate;
      }
    };
  }
});

// node_modules/@motionone/animation/dist/index.es.js
var init_index_es7 = __esm({
  "node_modules/@motionone/animation/dist/index.es.js"() {
    init_Animation_es();
    init_easing_es2();
  }
});

// node_modules/@motionone/dom/dist/animate/utils/easing.es.js
var convertEasing, cubicBezierAsString;
var init_easing_es3 = __esm({
  "node_modules/@motionone/dom/dist/animate/utils/easing.es.js"() {
    init_index_es2();
    convertEasing = (easing) => isCubicBezier(easing) ? cubicBezierAsString(easing) : easing;
    cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
  }
});

// node_modules/@motionone/dom/dist/animate/utils/feature-detection.es.js
var testAnimation, featureTests, results, supports;
var init_feature_detection_es = __esm({
  "node_modules/@motionone/dom/dist/animate/utils/feature-detection.es.js"() {
    testAnimation = (keyframes) => document.createElement("div").animate(keyframes, { duration: 1e-3 });
    featureTests = {
      cssRegisterProperty: () => typeof CSS !== "undefined" && Object.hasOwnProperty.call(CSS, "registerProperty"),
      waapi: () => Object.hasOwnProperty.call(Element.prototype, "animate"),
      partialKeyframes: () => {
        try {
          testAnimation({ opacity: [1] });
        } catch (e) {
          return false;
        }
        return true;
      },
      finished: () => Boolean(testAnimation({ opacity: [0, 1] }).finished)
    };
    results = {};
    supports = {};
    for (const key in featureTests) {
      supports[key] = () => {
        if (results[key] === void 0)
          results[key] = featureTests[key]();
        return results[key];
      };
    }
  }
});

// node_modules/@motionone/dom/dist/animate/utils/keyframes.es.js
function hydrateKeyframes(keyframes, readInitialValue) {
  for (let i = 0; i < keyframes.length; i++) {
    if (keyframes[i] === null) {
      keyframes[i] = i ? keyframes[i - 1] : readInitialValue();
    }
  }
  return keyframes;
}
var keyframesList;
var init_keyframes_es = __esm({
  "node_modules/@motionone/dom/dist/animate/utils/keyframes.es.js"() {
    keyframesList = (keyframes) => Array.isArray(keyframes) ? keyframes : [keyframes];
  }
});

// node_modules/@motionone/dom/dist/animate/utils/get-style-name.es.js
function getStyleName(key) {
  if (transformAlias[key])
    key = transformAlias[key];
  return isTransform(key) ? asTransformCssVar(key) : key;
}
var init_get_style_name_es = __esm({
  "node_modules/@motionone/dom/dist/animate/utils/get-style-name.es.js"() {
    init_transforms_es();
  }
});

// node_modules/@motionone/dom/dist/animate/style.es.js
var style;
var init_style_es = __esm({
  "node_modules/@motionone/dom/dist/animate/style.es.js"() {
    init_css_var_es();
    init_get_style_name_es();
    init_transforms_es();
    style = {
      get: (element, name) => {
        name = getStyleName(name);
        let value = isCssVar(name) ? element.style.getPropertyValue(name) : getComputedStyle(element)[name];
        if (!value && value !== 0) {
          const definition = transformDefinitions.get(name);
          if (definition)
            value = definition.initialValue;
        }
        return value;
      },
      set: (element, name, value) => {
        name = getStyleName(name);
        if (isCssVar(name)) {
          element.style.setProperty(name, value);
        } else {
          element.style[name] = value;
        }
      }
    };
  }
});

// node_modules/@motionone/dom/dist/animate/utils/stop-animation.es.js
function stopAnimation(animation, needsCommit = true) {
  if (!animation || animation.playState === "finished")
    return;
  try {
    if (animation.stop) {
      animation.stop();
    } else {
      needsCommit && animation.commitStyles();
      animation.cancel();
    }
  } catch (e) {
  }
}
var init_stop_animation_es = __esm({
  "node_modules/@motionone/dom/dist/animate/utils/stop-animation.es.js"() {
  }
});

// node_modules/@motionone/dom/dist/animate/animate-style.es.js
function getDevToolsRecord() {
  return window.__MOTION_DEV_TOOLS_RECORD;
}
function animateStyle(element, key, keyframesDefinition, options = {}) {
  const record = getDevToolsRecord();
  const isRecording = options.record !== false && record;
  let animation;
  let { duration = defaults.duration, delay = defaults.delay, endDelay = defaults.endDelay, repeat = defaults.repeat, easing = defaults.easing, direction, offset, allowWebkitAcceleration = false } = options;
  const data2 = getAnimationData(element);
  let canAnimateNatively = supports.waapi();
  const valueIsTransform = isTransform(key);
  valueIsTransform && addTransformToElement(element, key);
  const name = getStyleName(key);
  const motionValue = getMotionValue(data2.values, name);
  const definition = transformDefinitions.get(name);
  stopAnimation(motionValue.animation, !(isEasingGenerator(easing) && motionValue.generator) && options.record !== false);
  return () => {
    const readInitialValue = () => {
      var _a, _b;
      return (_b = (_a = style.get(element, name)) !== null && _a !== void 0 ? _a : definition === null || definition === void 0 ? void 0 : definition.initialValue) !== null && _b !== void 0 ? _b : 0;
    };
    let keyframes = hydrateKeyframes(keyframesList(keyframesDefinition), readInitialValue);
    if (isEasingGenerator(easing)) {
      const custom = easing.createAnimation(keyframes, readInitialValue, valueIsTransform, name, motionValue);
      easing = custom.easing;
      if (custom.keyframes !== void 0)
        keyframes = custom.keyframes;
      if (custom.duration !== void 0)
        duration = custom.duration;
    }
    if (isCssVar(name)) {
      if (supports.cssRegisterProperty()) {
        registerCssVariable(name);
      } else {
        canAnimateNatively = false;
      }
    }
    if (canAnimateNatively) {
      if (definition) {
        keyframes = keyframes.map((value) => isNumber(value) ? definition.toDefaultUnit(value) : value);
      }
      if (keyframes.length === 1 && (!supports.partialKeyframes() || isRecording)) {
        keyframes.unshift(readInitialValue());
      }
      const animationOptions = {
        delay: time.ms(delay),
        duration: time.ms(duration),
        endDelay: time.ms(endDelay),
        easing: !isEasingList(easing) ? convertEasing(easing) : void 0,
        direction,
        iterations: repeat + 1,
        fill: "both"
      };
      animation = element.animate({
        [name]: keyframes,
        offset,
        easing: isEasingList(easing) ? easing.map(convertEasing) : void 0
      }, animationOptions);
      if (!animation.finished) {
        animation.finished = new Promise((resolve, reject) => {
          animation.onfinish = resolve;
          animation.oncancel = reject;
        });
      }
      const target = keyframes[keyframes.length - 1];
      animation.finished.then(() => {
        style.set(element, name, target);
        animation.cancel();
      }).catch(noop);
      if (!allowWebkitAcceleration)
        animation.playbackRate = 1.000001;
    } else if (valueIsTransform) {
      keyframes = keyframes.map((value) => typeof value === "string" ? parseFloat(value) : value);
      if (keyframes.length === 1) {
        keyframes.unshift(parseFloat(readInitialValue()));
      }
      const render = (latest) => {
        if (definition)
          latest = definition.toDefaultUnit(latest);
        style.set(element, name, latest);
      };
      animation = new Animation(render, keyframes, Object.assign(Object.assign({}, options), {
        duration,
        easing
      }));
    } else {
      const target = keyframes[keyframes.length - 1];
      style.set(element, name, definition && isNumber(target) ? definition.toDefaultUnit(target) : target);
    }
    if (isRecording) {
      record(element, key, keyframes, {
        duration,
        delay,
        easing,
        repeat,
        offset
      }, "motion-one");
    }
    motionValue.setAnimation(animation);
    return animation;
  };
}
var init_animate_style_es = __esm({
  "node_modules/@motionone/dom/dist/animate/animate-style.es.js"() {
    init_data_es();
    init_css_var_es();
    init_index_es7();
    init_index_es2();
    init_transforms_es();
    init_easing_es3();
    init_feature_detection_es();
    init_keyframes_es();
    init_style_es();
    init_get_style_name_es();
    init_stop_animation_es();
  }
});

// node_modules/@motionone/dom/dist/animate/utils/options.es.js
var getOptions;
var init_options_es = __esm({
  "node_modules/@motionone/dom/dist/animate/utils/options.es.js"() {
    getOptions = (options, key) => (
      /**
       * TODO: Make test for this
       * Always return a new object otherwise delay is overwritten by results of stagger
       * and this results in no stagger
       */
      options[key] ? Object.assign(Object.assign({}, options), options[key]) : Object.assign({}, options)
    );
  }
});

// node_modules/@motionone/dom/dist/animate/utils/controls.es.js
var createAnimation, withControls, getActiveAnimation, controls, selectFinished;
var init_controls_es = __esm({
  "node_modules/@motionone/dom/dist/animate/utils/controls.es.js"() {
    init_index_es2();
    init_stop_animation_es();
    createAnimation = (factory) => factory();
    withControls = (animationFactory, options, duration = defaults.duration) => {
      return new Proxy({
        animations: animationFactory.map(createAnimation).filter(Boolean),
        duration,
        options
      }, controls);
    };
    getActiveAnimation = (state) => state.animations[0];
    controls = {
      get: (target, key) => {
        const activeAnimation = getActiveAnimation(target);
        switch (key) {
          case "duration":
            return target.duration;
          case "currentTime":
            return time.s((activeAnimation === null || activeAnimation === void 0 ? void 0 : activeAnimation[key]) || 0);
          case "playbackRate":
          case "playState":
            return activeAnimation === null || activeAnimation === void 0 ? void 0 : activeAnimation[key];
          case "finished":
            if (!target.finished) {
              target.finished = Promise.all(target.animations.map(selectFinished)).catch(noop);
            }
            return target.finished;
          case "stop":
            return () => {
              target.animations.forEach((animation) => stopAnimation(animation));
            };
          case "forEachNative":
            return (callback) => {
              target.animations.forEach((animation) => callback(animation, target));
            };
          default:
            return typeof (activeAnimation === null || activeAnimation === void 0 ? void 0 : activeAnimation[key]) === "undefined" ? void 0 : () => target.animations.forEach((animation) => animation[key]());
        }
      },
      set: (target, key, value) => {
        switch (key) {
          case "currentTime":
            value = time.ms(value);
          case "currentTime":
          case "playbackRate":
            for (let i = 0; i < target.animations.length; i++) {
              target.animations[i][key] = value;
            }
            return true;
        }
        return false;
      }
    };
    selectFinished = (animation) => animation.finished;
  }
});

// node_modules/@motionone/dom/dist/utils/stagger.es.js
function stagger(duration = 0.1, { start = 0, from = 0, easing } = {}) {
  return (i, total) => {
    const fromIndex = isNumber(from) ? from : getFromIndex(from, total);
    const distance = Math.abs(fromIndex - i);
    let delay = duration * distance;
    if (easing) {
      const maxDelay = total * duration;
      const easingFunction = getEasingFunction(easing);
      delay = easingFunction(delay / maxDelay) * maxDelay;
    }
    return start + delay;
  };
}
function getFromIndex(from, total) {
  if (from === "first") {
    return 0;
  } else {
    const lastIndex = total - 1;
    return from === "last" ? lastIndex : lastIndex / 2;
  }
}
function resolveOption(option, i, total) {
  return typeof option === "function" ? option(i, total) : option;
}
var init_stagger_es = __esm({
  "node_modules/@motionone/dom/dist/utils/stagger.es.js"() {
    init_index_es2();
    init_index_es7();
  }
});

// node_modules/@motionone/dom/dist/animate/index.es.js
function animate(elements, keyframes, options = {}) {
  elements = resolveElements(elements);
  const numElements = elements.length;
  const animationFactories = [];
  for (let i = 0; i < numElements; i++) {
    const element = elements[i];
    for (const key in keyframes) {
      const valueOptions = getOptions(options, key);
      valueOptions.delay = resolveOption(valueOptions.delay, i, numElements);
      const animation = animateStyle(element, key, keyframes[key], valueOptions);
      animationFactories.push(animation);
    }
  }
  return withControls(
    animationFactories,
    options,
    /**
     * TODO:
     * If easing is set to spring or glide, duration will be dynamically
     * generated. Ideally we would dynamically generate this from
     * animation.effect.getComputedTiming().duration but this isn't
     * supported in iOS13 or our number polyfill. Perhaps it's possible
     * to Proxy animations returned from animateStyle that has duration
     * as a getter.
     */
    options.duration
  );
}
var init_index_es8 = __esm({
  "node_modules/@motionone/dom/dist/animate/index.es.js"() {
    init_animate_style_es();
    init_options_es();
    init_resolve_elements_es();
    init_controls_es();
    init_stagger_es();
  }
});

// node_modules/@motionone/dom/dist/timeline/utils/calc-time.es.js
function calcNextTime(current, next, prev, labels) {
  var _a;
  if (isNumber(next)) {
    return next;
  } else if (next.startsWith("-") || next.startsWith("+")) {
    return Math.max(0, current + parseFloat(next));
  } else if (next === "<") {
    return prev;
  } else {
    return (_a = labels.get(next)) !== null && _a !== void 0 ? _a : current;
  }
}
var init_calc_time_es = __esm({
  "node_modules/@motionone/dom/dist/timeline/utils/calc-time.es.js"() {
    init_index_es2();
  }
});

// node_modules/@motionone/dom/dist/timeline/utils/edit.es.js
function eraseKeyframes(sequence, startTime, endTime) {
  for (let i = 0; i < sequence.length; i++) {
    const keyframe = sequence[i];
    if (keyframe.at > startTime && keyframe.at < endTime) {
      removeItem(sequence, keyframe);
      i--;
    }
  }
}
function addKeyframes(sequence, keyframes, easing, offset, startTime, endTime) {
  eraseKeyframes(sequence, startTime, endTime);
  for (let i = 0; i < keyframes.length; i++) {
    sequence.push({
      value: keyframes[i],
      at: mix(startTime, endTime, offset[i]),
      easing: getEasingForSegment(easing, i)
    });
  }
}
var init_edit_es = __esm({
  "node_modules/@motionone/dom/dist/timeline/utils/edit.es.js"() {
    init_index_es2();
  }
});

// node_modules/@motionone/dom/dist/timeline/utils/sort.es.js
function compareByTime(a, b) {
  if (a.at === b.at) {
    return a.value === null ? 1 : -1;
  } else {
    return a.at - b.at;
  }
}
var init_sort_es = __esm({
  "node_modules/@motionone/dom/dist/timeline/utils/sort.es.js"() {
  }
});

// node_modules/@motionone/dom/dist/timeline/index.es.js
function timeline(definition, options = {}) {
  var _a;
  const animationDefinitions = createAnimationsFromTimeline(definition, options);
  const animationFactories = animationDefinitions.map((definition2) => animateStyle(...definition2)).filter(Boolean);
  return withControls(
    animationFactories,
    options,
    // Get the duration from the first animation definition
    (_a = animationDefinitions[0]) === null || _a === void 0 ? void 0 : _a[3].duration
  );
}
function createAnimationsFromTimeline(definition, _a = {}) {
  var { defaultOptions = {} } = _a, timelineOptions = __rest(_a, ["defaultOptions"]);
  const animationDefinitions = [];
  const elementSequences = /* @__PURE__ */ new Map();
  const elementCache = {};
  const timeLabels = /* @__PURE__ */ new Map();
  let prevTime = 0;
  let currentTime = 0;
  let totalDuration = 0;
  for (let i = 0; i < definition.length; i++) {
    const segment = definition[i];
    if (isString(segment)) {
      timeLabels.set(segment, currentTime);
      continue;
    } else if (!Array.isArray(segment)) {
      timeLabels.set(segment.name, calcNextTime(currentTime, segment.at, prevTime, timeLabels));
      continue;
    }
    const [elementDefinition, keyframes, options = {}] = segment;
    if (options.at !== void 0) {
      currentTime = calcNextTime(currentTime, options.at, prevTime, timeLabels);
    }
    let maxDuration2 = 0;
    const elements = resolveElements(elementDefinition, elementCache);
    const numElements = elements.length;
    for (let elementIndex = 0; elementIndex < numElements; elementIndex++) {
      const element = elements[elementIndex];
      const elementSequence = getElementSequence(element, elementSequences);
      for (const key in keyframes) {
        const valueSequence = getValueSequence(key, elementSequence);
        let valueKeyframes = keyframesList(keyframes[key]);
        const valueOptions = getOptions(options, key);
        let { duration = defaultOptions.duration || defaults.duration, easing = defaultOptions.easing || defaults.easing } = valueOptions;
        if (isEasingGenerator(easing)) {
          const valueIsTransform = isTransform(key);
          invariant(valueKeyframes.length === 2 || !valueIsTransform, "spring must be provided 2 keyframes within timeline");
          const custom = easing.createAnimation(
            valueKeyframes,
            // TODO We currently only support explicit keyframes
            // so this doesn't currently read from the DOM
            () => "0",
            valueIsTransform
          );
          easing = custom.easing;
          if (custom.keyframes !== void 0)
            valueKeyframes = custom.keyframes;
          if (custom.duration !== void 0)
            duration = custom.duration;
        }
        const delay = resolveOption(options.delay, elementIndex, numElements) || 0;
        const startTime = currentTime + delay;
        const targetTime = startTime + duration;
        let { offset = defaultOffset(valueKeyframes.length) } = valueOptions;
        if (offset.length === 1 && offset[0] === 0) {
          offset[1] = 1;
        }
        const remainder = length - valueKeyframes.length;
        remainder > 0 && fillOffset(offset, remainder);
        valueKeyframes.length === 1 && valueKeyframes.unshift(null);
        addKeyframes(valueSequence, valueKeyframes, easing, offset, startTime, targetTime);
        maxDuration2 = Math.max(delay + duration, maxDuration2);
        totalDuration = Math.max(targetTime, totalDuration);
      }
    }
    prevTime = currentTime;
    currentTime += maxDuration2;
  }
  elementSequences.forEach((valueSequences, element) => {
    for (const key in valueSequences) {
      const valueSequence = valueSequences[key];
      valueSequence.sort(compareByTime);
      const keyframes = [];
      const valueOffset = [];
      const valueEasing = [];
      for (let i = 0; i < valueSequence.length; i++) {
        const { at, value, easing } = valueSequence[i];
        keyframes.push(value);
        valueOffset.push(progress(0, totalDuration, at));
        valueEasing.push(easing || defaults.easing);
      }
      if (valueOffset[0] !== 0) {
        valueOffset.unshift(0);
        keyframes.unshift(keyframes[0]);
        valueEasing.unshift("linear");
      }
      if (valueOffset[valueOffset.length - 1] !== 1) {
        valueOffset.push(1);
        keyframes.push(null);
      }
      animationDefinitions.push([
        element,
        key,
        keyframes,
        Object.assign(Object.assign(Object.assign({}, defaultOptions), { duration: totalDuration, easing: valueEasing, offset: valueOffset }), timelineOptions)
      ]);
    }
  });
  return animationDefinitions;
}
function getElementSequence(element, sequences) {
  !sequences.has(element) && sequences.set(element, {});
  return sequences.get(element);
}
function getValueSequence(name, sequences) {
  if (!sequences[name])
    sequences[name] = [];
  return sequences[name];
}
var init_index_es9 = __esm({
  "node_modules/@motionone/dom/dist/timeline/index.es.js"() {
    init_tslib_es6();
    init_hey_listen_es();
    init_index_es2();
    init_stagger_es();
    init_animate_style_es();
    init_controls_es();
    init_keyframes_es();
    init_options_es();
    init_resolve_elements_es();
    init_transforms_es();
    init_calc_time_es();
    init_edit_es();
    init_sort_es();
  }
});

// node_modules/@motionone/generators/dist/utils/velocity.es.js
function calcGeneratorVelocity(resolveValue, t, current) {
  const prevT = Math.max(t - sampleT, 0);
  return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}
var sampleT;
var init_velocity_es2 = __esm({
  "node_modules/@motionone/generators/dist/utils/velocity.es.js"() {
    init_index_es2();
    sampleT = 5;
  }
});

// node_modules/@motionone/generators/dist/spring/defaults.es.js
var defaults2;
var init_defaults_es2 = __esm({
  "node_modules/@motionone/generators/dist/spring/defaults.es.js"() {
    defaults2 = {
      stiffness: 100,
      damping: 10,
      mass: 1
    };
  }
});

// node_modules/@motionone/generators/dist/spring/utils.es.js
var calcDampingRatio;
var init_utils_es = __esm({
  "node_modules/@motionone/generators/dist/spring/utils.es.js"() {
    init_defaults_es2();
    calcDampingRatio = (stiffness = defaults2.stiffness, damping = defaults2.damping, mass = defaults2.mass) => damping / (2 * Math.sqrt(stiffness * mass));
  }
});

// node_modules/@motionone/generators/dist/utils/has-reached-target.es.js
function hasReachedTarget(origin, target, current) {
  return origin < target && current >= target || origin > target && current <= target;
}
var init_has_reached_target_es = __esm({
  "node_modules/@motionone/generators/dist/utils/has-reached-target.es.js"() {
  }
});

// node_modules/@motionone/generators/dist/spring/index.es.js
var spring;
var init_index_es10 = __esm({
  "node_modules/@motionone/generators/dist/spring/index.es.js"() {
    init_index_es2();
    init_defaults_es2();
    init_utils_es();
    init_has_reached_target_es();
    init_velocity_es2();
    spring = ({ stiffness = defaults2.stiffness, damping = defaults2.damping, mass = defaults2.mass, from = 0, to = 1, velocity = 0, restSpeed, restDistance } = {}) => {
      velocity = velocity ? time.s(velocity) : 0;
      const state = {
        done: false,
        hasReachedTarget: false,
        current: from,
        target: to
      };
      const initialDelta = to - from;
      const undampedAngularFreq = Math.sqrt(stiffness / mass) / 1e3;
      const dampingRatio = calcDampingRatio(stiffness, damping, mass);
      const isGranularScale = Math.abs(initialDelta) < 5;
      restSpeed || (restSpeed = isGranularScale ? 0.01 : 2);
      restDistance || (restDistance = isGranularScale ? 5e-3 : 0.5);
      let resolveSpring;
      if (dampingRatio < 1) {
        const angularFreq = undampedAngularFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
        resolveSpring = (t) => to - Math.exp(-dampingRatio * undampedAngularFreq * t) * ((-velocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
      } else {
        resolveSpring = (t) => {
          return to - Math.exp(-undampedAngularFreq * t) * (initialDelta + (-velocity + undampedAngularFreq * initialDelta) * t);
        };
      }
      return (t) => {
        state.current = resolveSpring(t);
        const currentVelocity = t === 0 ? velocity : calcGeneratorVelocity(resolveSpring, t, state.current);
        const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
        const isBelowDisplacementThreshold = Math.abs(to - state.current) <= restDistance;
        state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
        state.hasReachedTarget = hasReachedTarget(from, to, state.current);
        return state;
      };
    };
  }
});

// node_modules/@motionone/generators/dist/glide/index.es.js
var glide;
var init_index_es11 = __esm({
  "node_modules/@motionone/generators/dist/glide/index.es.js"() {
    init_index_es2();
    init_velocity_es2();
    init_index_es10();
    glide = ({ from = 0, velocity = 0, power = 0.8, decay = 0.325, bounceDamping, bounceStiffness, changeTarget, min, max, restDistance = 0.5, restSpeed }) => {
      decay = time.ms(decay);
      const state = {
        hasReachedTarget: false,
        done: false,
        current: from,
        target: from
      };
      const isOutOfBounds = (v) => min !== void 0 && v < min || max !== void 0 && v > max;
      const nearestBoundary = (v) => {
        if (min === void 0)
          return max;
        if (max === void 0)
          return min;
        return Math.abs(min - v) < Math.abs(max - v) ? min : max;
      };
      let amplitude = power * velocity;
      const ideal = from + amplitude;
      const target = changeTarget === void 0 ? ideal : changeTarget(ideal);
      state.target = target;
      if (target !== ideal)
        amplitude = target - from;
      const calcDelta = (t) => -amplitude * Math.exp(-t / decay);
      const calcLatest = (t) => target + calcDelta(t);
      const applyFriction = (t) => {
        const delta = calcDelta(t);
        const latest = calcLatest(t);
        state.done = Math.abs(delta) <= restDistance;
        state.current = state.done ? target : latest;
      };
      let timeReachedBoundary;
      let spring$1;
      const checkCatchBoundary = (t) => {
        if (!isOutOfBounds(state.current))
          return;
        timeReachedBoundary = t;
        spring$1 = spring({
          from: state.current,
          to: nearestBoundary(state.current),
          velocity: calcGeneratorVelocity(calcLatest, t, state.current),
          // TODO: This should be passing * 1000
          damping: bounceDamping,
          stiffness: bounceStiffness,
          restDistance,
          restSpeed
        });
      };
      checkCatchBoundary(0);
      return (t) => {
        let hasUpdatedFrame = false;
        if (!spring$1 && timeReachedBoundary === void 0) {
          hasUpdatedFrame = true;
          applyFriction(t);
          checkCatchBoundary(t);
        }
        if (timeReachedBoundary !== void 0 && t > timeReachedBoundary) {
          state.hasReachedTarget = true;
          return spring$1(t - timeReachedBoundary);
        } else {
          state.hasReachedTarget = false;
          !hasUpdatedFrame && applyFriction(t);
          return state;
        }
      };
    };
  }
});

// node_modules/@motionone/generators/dist/utils/pregenerate-keyframes.es.js
function pregenerateKeyframes(generator, toUnit = noopReturn) {
  let overshootDuration = void 0;
  let timestamp = timeStep;
  let state = generator(0);
  const keyframes = [toUnit(state.current)];
  while (!state.done && timestamp < maxDuration) {
    state = generator(timestamp);
    keyframes.push(toUnit(state.done ? state.target : state.current));
    if (overshootDuration === void 0 && state.hasReachedTarget) {
      overshootDuration = timestamp;
    }
    timestamp += timeStep;
  }
  const duration = timestamp - timeStep;
  if (keyframes.length === 1)
    keyframes.push(state.current);
  return {
    keyframes,
    duration: duration / 1e3,
    overshootDuration: (overshootDuration !== null && overshootDuration !== void 0 ? overshootDuration : duration) / 1e3
  };
}
var timeStep, maxDuration;
var init_pregenerate_keyframes_es = __esm({
  "node_modules/@motionone/generators/dist/utils/pregenerate-keyframes.es.js"() {
    init_index_es2();
    timeStep = 10;
    maxDuration = 1e4;
  }
});

// node_modules/@motionone/generators/dist/index.es.js
var init_index_es12 = __esm({
  "node_modules/@motionone/generators/dist/index.es.js"() {
    init_index_es11();
    init_index_es10();
    init_pregenerate_keyframes_es();
    init_velocity_es2();
  }
});

// node_modules/@motionone/dom/dist/easing/create-generator-easing.es.js
function createGeneratorEasing(createGenerator) {
  const keyframesCache = /* @__PURE__ */ new WeakMap();
  return (options = {}) => {
    const generatorCache = /* @__PURE__ */ new Map();
    const getGenerator = (from = 0, to = 100, velocity = 0, isScale = false) => {
      const key = `${from}-${to}-${velocity}-${isScale}`;
      if (!generatorCache.has(key)) {
        generatorCache.set(key, createGenerator(Object.assign({
          from,
          to,
          velocity,
          restSpeed: isScale ? 0.05 : 2,
          restDistance: isScale ? 0.01 : 0.5
        }, options)));
      }
      return generatorCache.get(key);
    };
    const getKeyframes = (generator) => {
      if (!keyframesCache.has(generator)) {
        keyframesCache.set(generator, pregenerateKeyframes(generator));
      }
      return keyframesCache.get(generator);
    };
    return {
      createAnimation: (keyframes, getOrigin, canUseGenerator, name, motionValue) => {
        var _a, _b;
        let settings;
        const numKeyframes = keyframes.length;
        let shouldUseGenerator = canUseGenerator && numKeyframes <= 2 && keyframes.every(isNumberOrNull);
        if (shouldUseGenerator) {
          const target = keyframes[numKeyframes - 1];
          const unresolvedOrigin = numKeyframes === 1 ? null : keyframes[0];
          let velocity = 0;
          let origin = 0;
          const prevGenerator = motionValue === null || motionValue === void 0 ? void 0 : motionValue.generator;
          if (prevGenerator) {
            const { animation, generatorStartTime } = motionValue;
            const startTime = (animation === null || animation === void 0 ? void 0 : animation.startTime) || generatorStartTime || 0;
            const currentTime = (animation === null || animation === void 0 ? void 0 : animation.currentTime) || performance.now() - startTime;
            const prevGeneratorCurrent = prevGenerator(currentTime).current;
            origin = (_a = unresolvedOrigin) !== null && _a !== void 0 ? _a : prevGeneratorCurrent;
            if (numKeyframes === 1 || numKeyframes === 2 && keyframes[0] === null) {
              velocity = calcGeneratorVelocity((t) => prevGenerator(t).current, currentTime, prevGeneratorCurrent);
            }
          } else {
            origin = (_b = unresolvedOrigin) !== null && _b !== void 0 ? _b : parseFloat(getOrigin());
          }
          const generator = getGenerator(origin, target, velocity, name === null || name === void 0 ? void 0 : name.includes("scale"));
          const keyframesMetadata = getKeyframes(generator);
          settings = Object.assign(Object.assign({}, keyframesMetadata), { easing: "linear" });
          if (motionValue) {
            motionValue.generator = generator;
            motionValue.generatorStartTime = performance.now();
          }
        } else {
          const keyframesMetadata = getKeyframes(getGenerator(0, 100));
          settings = {
            easing: "ease",
            duration: keyframesMetadata.overshootDuration
          };
        }
        return settings;
      }
    };
  };
}
var isNumberOrNull;
var init_create_generator_easing_es = __esm({
  "node_modules/@motionone/dom/dist/easing/create-generator-easing.es.js"() {
    init_index_es12();
    isNumberOrNull = (value) => typeof value !== "string";
  }
});

// node_modules/@motionone/dom/dist/easing/spring/index.es.js
var spring2;
var init_index_es13 = __esm({
  "node_modules/@motionone/dom/dist/easing/spring/index.es.js"() {
    init_index_es12();
    init_create_generator_easing_es();
    spring2 = createGeneratorEasing(spring);
  }
});

// node_modules/@motionone/dom/dist/easing/glide/index.es.js
var glide2;
var init_index_es14 = __esm({
  "node_modules/@motionone/dom/dist/easing/glide/index.es.js"() {
    init_index_es12();
    init_create_generator_easing_es();
    glide2 = createGeneratorEasing(glide);
  }
});

// node_modules/@motionone/dom/dist/state/utils/has-changed.es.js
function hasChanged(a, b) {
  if (typeof a !== typeof b)
    return true;
  if (Array.isArray(a) && Array.isArray(b))
    return !shallowCompare(a, b);
  return a !== b;
}
function shallowCompare(next, prev) {
  const prevLength = prev.length;
  if (prevLength !== next.length)
    return false;
  for (let i = 0; i < prevLength; i++) {
    if (prev[i] !== next[i])
      return false;
  }
  return true;
}
var init_has_changed_es = __esm({
  "node_modules/@motionone/dom/dist/state/utils/has-changed.es.js"() {
  }
});

// node_modules/@motionone/dom/dist/state/utils/is-variant.es.js
function isVariant(definition) {
  return typeof definition === "object";
}
var init_is_variant_es = __esm({
  "node_modules/@motionone/dom/dist/state/utils/is-variant.es.js"() {
  }
});

// node_modules/@motionone/dom/dist/state/utils/resolve-variant.es.js
function resolveVariant(definition, variants) {
  if (isVariant(definition)) {
    return definition;
  } else if (definition && variants) {
    return variants[definition];
  }
}
var init_resolve_variant_es = __esm({
  "node_modules/@motionone/dom/dist/state/utils/resolve-variant.es.js"() {
    init_is_variant_es();
  }
});

// node_modules/@motionone/dom/dist/state/utils/schedule.es.js
function processScheduledAnimations() {
  if (!scheduled)
    return;
  const generators = scheduled.sort(compareByDepth).map(fireAnimateUpdates);
  generators.forEach(fireNext);
  generators.forEach(fireNext);
  scheduled = void 0;
}
function scheduleAnimation(state) {
  if (!scheduled) {
    scheduled = [state];
    requestAnimationFrame(processScheduledAnimations);
  } else {
    addUniqueItem(scheduled, state);
  }
}
function unscheduleAnimation(state) {
  scheduled && removeItem(scheduled, state);
}
var scheduled, compareByDepth, fireAnimateUpdates, fireNext;
var init_schedule_es = __esm({
  "node_modules/@motionone/dom/dist/state/utils/schedule.es.js"() {
    init_index_es2();
    scheduled = void 0;
    compareByDepth = (a, b) => a.getDepth() - b.getDepth();
    fireAnimateUpdates = (state) => state.animateUpdates();
    fireNext = (iterator) => iterator.next();
  }
});

// node_modules/@motionone/dom/dist/state/utils/events.es.js
function dispatchPointerEvent(element, name, event) {
  element.dispatchEvent(new CustomEvent(name, { detail: { originalEvent: event } }));
}
function dispatchViewEvent(element, name, entry) {
  element.dispatchEvent(new CustomEvent(name, { detail: { originalEntry: entry } }));
}
var motionEvent;
var init_events_es = __esm({
  "node_modules/@motionone/dom/dist/state/utils/events.es.js"() {
    motionEvent = (name, target) => new CustomEvent(name, { detail: { target } });
  }
});

// node_modules/@motionone/dom/dist/state/gestures/in-view.es.js
var inView2;
var init_in_view_es2 = __esm({
  "node_modules/@motionone/dom/dist/state/gestures/in-view.es.js"() {
    init_tslib_es6();
    init_events_es();
    init_in_view_es();
    inView2 = {
      isActive: (options) => Boolean(options.inView),
      subscribe: (element, { enable, disable }, { inViewOptions = {} }) => {
        const { once } = inViewOptions, viewOptions = __rest(inViewOptions, ["once"]);
        return inView(element, (enterEntry) => {
          enable();
          dispatchViewEvent(element, "viewenter", enterEntry);
          if (!once) {
            return (leaveEntry) => {
              disable();
              dispatchViewEvent(element, "viewleave", leaveEntry);
            };
          }
        }, viewOptions);
      }
    };
  }
});

// node_modules/@motionone/dom/dist/state/gestures/hover.es.js
var mouseEvent, hover;
var init_hover_es = __esm({
  "node_modules/@motionone/dom/dist/state/gestures/hover.es.js"() {
    init_events_es();
    mouseEvent = (element, name, action) => (event) => {
      if (event.pointerType && event.pointerType !== "mouse")
        return;
      action();
      dispatchPointerEvent(element, name, event);
    };
    hover = {
      isActive: (options) => Boolean(options.hover),
      subscribe: (element, { enable, disable }) => {
        const onEnter = mouseEvent(element, "hoverstart", enable);
        const onLeave = mouseEvent(element, "hoverend", disable);
        element.addEventListener("pointerenter", onEnter);
        element.addEventListener("pointerleave", onLeave);
        return () => {
          element.removeEventListener("pointerenter", onEnter);
          element.removeEventListener("pointerleave", onLeave);
        };
      }
    };
  }
});

// node_modules/@motionone/dom/dist/state/gestures/press.es.js
var press;
var init_press_es = __esm({
  "node_modules/@motionone/dom/dist/state/gestures/press.es.js"() {
    init_events_es();
    press = {
      isActive: (options) => Boolean(options.press),
      subscribe: (element, { enable, disable }) => {
        const onPointerUp = (event) => {
          disable();
          dispatchPointerEvent(element, "pressend", event);
          window.removeEventListener("pointerup", onPointerUp);
        };
        const onPointerDown = (event) => {
          enable();
          dispatchPointerEvent(element, "pressstart", event);
          window.addEventListener("pointerup", onPointerUp);
        };
        element.addEventListener("pointerdown", onPointerDown);
        return () => {
          element.removeEventListener("pointerdown", onPointerDown);
          window.removeEventListener("pointerup", onPointerUp);
        };
      }
    };
  }
});

// node_modules/@motionone/dom/dist/state/index.es.js
function createMotionState(options = {}, parent) {
  let element;
  let depth = parent ? parent.getDepth() + 1 : 0;
  const activeStates = { initial: true, animate: true };
  const gestureSubscriptions = {};
  const context = {};
  for (const name of stateTypes) {
    context[name] = typeof options[name] === "string" ? options[name] : parent === null || parent === void 0 ? void 0 : parent.getContext()[name];
  }
  const initialVariantSource = options.initial === false ? "animate" : "initial";
  let _a = resolveVariant(options[initialVariantSource] || context[initialVariantSource], options.variants) || {}, target = __rest(_a, ["transition"]);
  const baseTarget = Object.assign({}, target);
  function* animateUpdates() {
    var _a2, _b;
    const prevTarget = target;
    target = {};
    const animationOptions = {};
    for (const name of stateTypes) {
      if (!activeStates[name])
        continue;
      const variant = resolveVariant(options[name]);
      if (!variant)
        continue;
      for (const key in variant) {
        if (key === "transition")
          continue;
        target[key] = variant[key];
        animationOptions[key] = getOptions((_b = (_a2 = variant.transition) !== null && _a2 !== void 0 ? _a2 : options.transition) !== null && _b !== void 0 ? _b : {}, key);
      }
    }
    const allTargetKeys = /* @__PURE__ */ new Set([
      ...Object.keys(target),
      ...Object.keys(prevTarget)
    ]);
    const animationFactories = [];
    allTargetKeys.forEach((key) => {
      var _a3;
      if (target[key] === void 0) {
        target[key] = baseTarget[key];
      }
      if (hasChanged(prevTarget[key], target[key])) {
        (_a3 = baseTarget[key]) !== null && _a3 !== void 0 ? _a3 : baseTarget[key] = style.get(element, key);
        animationFactories.push(animateStyle(element, key, target[key], animationOptions[key]));
      }
    });
    yield;
    const animations = animationFactories.map((factory) => factory()).filter(Boolean);
    if (!animations.length)
      return;
    const animationTarget = target;
    element.dispatchEvent(motionEvent("motionstart", animationTarget));
    Promise.all(animations.map((animation) => animation.finished)).then(() => {
      element.dispatchEvent(motionEvent("motioncomplete", animationTarget));
    }).catch(noop);
  }
  const setGesture = (name, isActive) => () => {
    activeStates[name] = isActive;
    scheduleAnimation(state);
  };
  const updateGestureSubscriptions = () => {
    for (const name in gestures) {
      const isGestureActive = gestures[name].isActive(options);
      const remove = gestureSubscriptions[name];
      if (isGestureActive && !remove) {
        gestureSubscriptions[name] = gestures[name].subscribe(element, {
          enable: setGesture(name, true),
          disable: setGesture(name, false)
        }, options);
      } else if (!isGestureActive && remove) {
        remove();
        delete gestureSubscriptions[name];
      }
    }
  };
  const state = {
    update: (newOptions) => {
      if (!element)
        return;
      options = newOptions;
      updateGestureSubscriptions();
      scheduleAnimation(state);
    },
    setActive: (name, isActive) => {
      if (!element)
        return;
      activeStates[name] = isActive;
      scheduleAnimation(state);
    },
    animateUpdates,
    getDepth: () => depth,
    getTarget: () => target,
    getOptions: () => options,
    getContext: () => context,
    mount: (newElement) => {
      invariant(Boolean(newElement), "Animation state must be mounted with valid Element");
      element = newElement;
      mountedStates.set(element, state);
      updateGestureSubscriptions();
      return () => {
        mountedStates.delete(element);
        unscheduleAnimation(state);
        for (const key in gestureSubscriptions) {
          gestureSubscriptions[key]();
        }
      };
    },
    isMounted: () => Boolean(element)
  };
  return state;
}
var gestures, stateTypes, mountedStates;
var init_index_es15 = __esm({
  "node_modules/@motionone/dom/dist/state/index.es.js"() {
    init_tslib_es6();
    init_hey_listen_es();
    init_index_es2();
    init_animate_style_es();
    init_style_es();
    init_options_es();
    init_has_changed_es();
    init_resolve_variant_es();
    init_schedule_es();
    init_in_view_es2();
    init_hover_es();
    init_press_es();
    init_events_es();
    gestures = { inView: inView2, hover, press };
    stateTypes = ["initial", "animate", ...Object.keys(gestures), "exit"];
    mountedStates = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/@motionone/dom/dist/animate/utils/style-object.es.js
function createStyles(keyframes) {
  const initialKeyframes = {};
  const transformKeys = [];
  for (let key in keyframes) {
    const value = keyframes[key];
    if (isTransform(key)) {
      if (transformAlias[key])
        key = transformAlias[key];
      transformKeys.push(key);
      key = asTransformCssVar(key);
    }
    let initialKeyframe = Array.isArray(value) ? value[0] : value;
    const definition = transformDefinitions.get(key);
    if (definition) {
      initialKeyframe = isNumber(value) ? definition.toDefaultUnit(value) : value;
    }
    initialKeyframes[key] = initialKeyframe;
  }
  if (transformKeys.length) {
    initialKeyframes.transform = buildTransformTemplate(transformKeys);
  }
  return initialKeyframes;
}
var init_style_object_es = __esm({
  "node_modules/@motionone/dom/dist/animate/utils/style-object.es.js"() {
    init_index_es2();
    init_transforms_es();
  }
});

// node_modules/@motionone/dom/dist/animate/utils/style-string.es.js
function createStyleString(target = {}) {
  const styles = createStyles(target);
  let style2 = "";
  for (const key in styles) {
    style2 += key.startsWith("--") ? key : camelToPipeCase(key);
    style2 += `: ${styles[key]}; `;
  }
  return style2;
}
var camelLetterToPipeLetter, camelToPipeCase;
var init_style_string_es = __esm({
  "node_modules/@motionone/dom/dist/animate/utils/style-string.es.js"() {
    init_style_object_es();
    camelLetterToPipeLetter = (letter) => `-${letter.toLowerCase()}`;
    camelToPipeCase = (str) => str.replace(/[A-Z]/g, camelLetterToPipeLetter);
  }
});

// node_modules/@motionone/dom/dist/index.es.js
var index_es_exports = {};
__export(index_es_exports, {
  ScrollOffset: () => ScrollOffset,
  animate: () => animate,
  animateStyle: () => animateStyle,
  createMotionState: () => createMotionState,
  createStyleString: () => createStyleString,
  createStyles: () => createStyles,
  getAnimationData: () => getAnimationData,
  getStyleName: () => getStyleName,
  glide: () => glide2,
  inView: () => inView,
  mountedStates: () => mountedStates,
  resize: () => resize,
  scroll: () => scroll,
  spring: () => spring2,
  stagger: () => stagger,
  style: () => style,
  timeline: () => timeline,
  withControls: () => withControls
});
var init_index_es16 = __esm({
  "node_modules/@motionone/dom/dist/index.es.js"() {
    init_index_es8();
    init_animate_style_es();
    init_index_es9();
    init_stagger_es();
    init_index_es13();
    init_index_es14();
    init_style_es();
    init_in_view_es();
    init_index_es();
    init_index_es4();
    init_presets_es();
    init_controls_es();
    init_data_es();
    init_get_style_name_es();
    init_index_es15();
    init_style_object_es();
    init_style_string_es();
  }
});

// node_modules/@emotion/memoize/dist/memoize.browser.esm.js
function memoize(fn) {
  var cache = {};
  return function(arg) {
    if (cache[arg] === void 0) cache[arg] = fn(arg);
    return cache[arg];
  };
}
var memoize_browser_esm_default;
var init_memoize_browser_esm = __esm({
  "node_modules/@emotion/memoize/dist/memoize.browser.esm.js"() {
    memoize_browser_esm_default = memoize;
  }
});

// node_modules/@emotion/is-prop-valid/dist/is-prop-valid.browser.esm.js
var is_prop_valid_browser_esm_exports = {};
__export(is_prop_valid_browser_esm_exports, {
  default: () => is_prop_valid_browser_esm_default
});
var reactPropsRegex, index, is_prop_valid_browser_esm_default;
var init_is_prop_valid_browser_esm = __esm({
  "node_modules/@emotion/is-prop-valid/dist/is-prop-valid.browser.esm.js"() {
    init_memoize_browser_esm();
    reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
    index = memoize_browser_esm_default(
      function(prop) {
        return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
      }
      /* Z+1 */
    );
    is_prop_valid_browser_esm_default = index;
  }
});

export {
  warning,
  invariant,
  hey_listen_es_exports,
  init_hey_listen_es,
  inView,
  scroll,
  index_es_exports,
  init_index_es16 as init_index_es,
  is_prop_valid_browser_esm_exports,
  init_is_prop_valid_browser_esm
};
//# sourceMappingURL=chunk-P2XIBMDM.js.map
