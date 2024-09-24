let state

const onMessage = (ev) => {
  // console.log('worker:', ev)
  switch (ev.data.type) {
    case 'set-state':
      state = ev.data.state
      break
    case 'print-state':
      console.log('worker.state:', state)
      break
    case 'merge-state':
      Object.assign(state, ev.data.merge)
      console.log('worker.state:', state)
      self.postMessage({ type: 'merge-state', state })
      break
    case 'get-state':
      self.postMessage({ type: 'get-state', state })
      break
    default:
      console.error('unknown message type:', ev.data.type)
  }
}

// Listen to main thread
self.addEventListener('message', onMessage)
