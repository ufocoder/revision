import { h, projector } from "maquette"
import { inject } from "../libs/css"

inject(`
progress-bar {
  margin: auto;
  background-color: #998;
  box-shadow: inset 0 0 30px #665;
  min-width: 50%;
  text-align: center;
  font-size: 12px;
}
progress-bar .progress {
  transition: width 1s;
  background-color: #2af;
  height: 3em;
  box-shadow: inset 0 0 30px #12f;

}
progress-bar .message {
  height: 3em;
  line-height: 3em;
  margin-top: -3em;
  white-space: nowrap;
  padding: 0 10px;
  color: #000;
  text-shadow: 0 0 1px #fff;
  font-weight: bold;
  font-family: ubuntu, sans-serif;
}
`);

export function ProgressBar(message) {
  let total = 0,
      done = 0;

  return { update, render };

  function update(newDone, newTotal) {
    done = newDone;
    total = newTotal;
    projector.scheduleRender();
  }
  function render() {
    let percent = (done && total) ?
      (done * 100 / total) : 0;
    return h("progress-bar", [
      h('div.progress', {styles:{width:`${percent}%`}}),
      h('div.message', [
        `${message} (${done}/${total})`
      ])
    ]);
  }
}