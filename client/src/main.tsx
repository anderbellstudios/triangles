import { h, render } from 'preact'
import '@12joan/preact-hint/dist/style.css'
import { App } from './App'
import { appState } from './appState'
import { joinRemoteGame, leaveRemoteGame } from './appState/onlinePlay/actions'
import { uploadGame } from './api'
import './index.css'
import './onlinePlayAdapter'
import './aiAdapter'

const handleURLChange = async () => {
  const gameID = window.location.pathname.match(/^\/game\/(.*)/)?.[1]

  if (gameID === undefined) {
    if (window.location.pathname !== '/') {
      window.location.replace('/')
    } else {
      leaveRemoteGame(false)
    }
  } else {
    await uploadGame(gameID, appState.get('app.game')).catch(console.error)
    joinRemoteGame(gameID, false)
  }
}

window.addEventListener('popstate', handleURLChange)

handleURLChange().then(() => {
  render(<App />, document.querySelector('#app')!)
})
