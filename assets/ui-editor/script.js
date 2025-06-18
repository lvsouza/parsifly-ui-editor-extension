console.log('Script carregado no HTML de /assets')

console.log(window.parent)

import * as Comlink from 'https://unpkg.com/comlink/dist/esm/comlink.mjs'

const exposed = {
  exposedMethod() {
    console.log('Chamado do parent!')
  }
}

window.addEventListener('message', (event) => {
  if (event.data?.type === 'connect' && event.data.port) {
    const port = event.data.port;
    Comlink.expose(exposed, port)
  }
})
