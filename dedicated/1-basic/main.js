let worker = new Worker('/worker.js')
let cb = undefined

let state = {
  a: 1,
  b: 1,
  c: 1,
}

const onMessage = (ev) => {
  switch (ev.data.type) {
    case 'merge-state':
    case 'get-state':
      if (cb) {
        cb(ev)
        cb = undefined
      } else {
        console.log("main: main.state", state)
        console.log("main: worker.state", ev.state)
      }
      break

    default:
      console.error('unknown message type:', ev.data.type)
  }
}

worker.addEventListener('message', onMessage)
worker.postMessage({ type: 'set-state', state })

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function test() {
  //
  // are the states linked? = no
  //

  // - change main.state, get worker.state, compare
  // - result = worker.state not changed when main.state is changed
  console.log('%cCheck whether change in main.state automatically propagates to worker.state', 'color: white; background-color: #007acc;')
  state.b = 2;
  console.log("main.state", state)
  let workerState = await new Promise((resolve) => {
    cb = (ev) => {
      resolve(ev.data.state)
    }
    worker.postMessage({ type: 'get-state' })
  });
  console.log("worker.state", workerState)
  if (state.b === workerState.b) {
    console.log('%cresult:', 'color: white; background-color: #ff0000;', 'worker.state & main.state are shared', )
  } else {
    console.log('%cresult:', 'color: white; background-color: #00ff00;', 'worker.state NOT changed when main.state is changed')
  }

  // - change worker.state, has main.state changed?
  console.log('%cCheck whether change in worker.state automatically propagates to main.state?', 'color: white; background-color: #007acc;')
  workerState = await new Promise((resolve) => {
    cb = (ev) => {
      resolve(ev.data.state)
    }
    worker.postMessage({ type: 'merge-state', merge: { c: 3 } })
  })
  if (state.c === workerState.c) {
    console.log('%cresult:', 'color: white; background-color: #ff0000;', 'worker.state & main.state are shared', )
  } else {
    console.log('%cresult:', 'color: white; background-color: #00ff00;', 'main.state NOT changed when worker.state is changed')
  }

  //
  // can various types serialize properly? or at they passed as strings? i.e. check:
  //
  // - Date, regex, Set
  // - todo: Map, ArrayBuffer, TypedArray, BigInt, Symbol
  console.log('%cCheck whether complex types serialize properly', 'color: white; background-color: #007acc;')
  worker.postMessage({ type: 'merge-state', merge: { d: new Date, r: /a regex/i, s: new Set([1,2,3]) } })
  workerState = await new Promise((resolve) => {
    cb = (ev) => {
      resolve(ev.data.state)
    }
    worker.postMessage({ type: 'merge-state', merge: { c: 3 } })
  })
  if (workerState.d instanceof Date && workerState.r instanceof RegExp && workerState.s instanceof Set) {
    console.log('%cresult:', 'color: white; background-color: #00ff00;', 'ser/deser works properly for complex types')
  } else {
    console.log('%cresult:', 'color: white; background-color: #ff0000;', 'ser/deser NOT working for complex types', )
  }

  // console.log('%c', 'color: white; background-color: #007acc;')
}

test()