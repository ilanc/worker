importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
// importScripts("../../../dist/umd/comlink.js");

async function remoteFunction(cb) {
  await cb("A string from a worker");
}

Comlink.expose(remoteFunction);