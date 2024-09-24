import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
// import * as Comlink from "../../../dist/esm/comlink.mjs";
function callback(value) {
  alert(`Result: ${value}`);
}
async function init() {
  const remoteFunction = Comlink.wrap(new Worker("callback.worker.js"));
  await remoteFunction(Comlink.proxy(callback));
}
init();