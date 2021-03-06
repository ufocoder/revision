import { h, VNode } from "../libs/maquette"
import { projector, style } from "../libs/router"

export interface SplitView {
  (): VNode
}

export function SplitView(left: () => VNode, right: () => VNode, size: number) {
  let position = null;
  let isTouch;
  let horizontal = true;
  let orientation = "left";

  let split = render as SplitView
  return split

  function render() {
    if (size < 0) size = 0;
    return h("split-view", [
      h("div.left", {
        key: left,
        styles: { width: size + "px" }
      }, left()),
      h("div.right", {
        key: right,
        styles: { left: (size + 5) + "px" }
      }, right()),
      h("div.resizer", {
        styles:{left:size + "px"},
        onmousedown: onStart,
        ontouchstart: onStart
      })
    ]);
  }

  function onStart(evt) {
    if (position !== null) return;
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.touches) {
      evt = evt.touches[0];
      isTouch = true;
    }
    else {
      isTouch = false;
    }
    if (horizontal) {
      position = evt.clientX;
    }
    else {
      position = evt.clientY;
    }
    if (isTouch) {
      window.addEventListener("touchmove", onMove, true);
      window.addEventListener('touchend', onEnd, true);
    }
    else {
      window.addEventListener("mousemove", onMove, true);
      window.addEventListener('mouseup', onEnd, true);
    }
  }

  function onMove(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.touches) {
      evt = evt.touches[0];
    }
    let delta;
    if (horizontal) {
      delta = evt.clientX - position;
      position = evt.clientX;
      if (orientation === "left") {
        size += delta;
      }
      else {
        size -= delta;
      }
    }
    else {
      delta = evt.clientY - position;
      position = evt.clientY;
      if (orientation === "top") {
        size += delta;
      }
      else {
        size -= delta;
      }
    }
    // if (savedSize) {
    //   savedSize = undefined;
    // }
    projector.scheduleRender();
  }

  function onEnd() {
    if (isTouch) {
      window.removeEventListener("touchmove", onMove, true);
      window.removeEventListener('touchend', onEnd, true);
    }
    else {
      window.removeEventListener("mousemove", onMove, true);
      window.removeEventListener('mouseup', onEnd, true);
    }
    position = null;
    isTouch = null;
    projector.scheduleRender();

  }

}

style(`
  split-view {
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    overflow: hidden;
  }
  split-view > div {
    position: absolute;
    height: 100%;
    top: 0;
    bottom: 0;
  }
  split-view > .left {
    left: 0;
    overflow: auto;
  }
  split-view > .right {
    right: 0;
    width: auto;
    overflow: auto;
  }
  split-view > .resizer {
    width: 5px;
    cursor: ew-resize;
  }
`);
