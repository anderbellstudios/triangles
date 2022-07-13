import { h, render } from 'preact'
import '@12joan/preact-hint/dist/style.css'
import App from './App'
import { performNewGame } from './appState/game/actions'
import { joinRemoteGame, leaveRemoteGame } from './appState/onlinePlay/actions'
import './index.css'
import './onlinePlayAdapter'

const handleURLChange = (event = undefined) => {
  const gameID = window.location.pathname.match(/^\/game\/(.*)/)?.[1]

  if (gameID === undefined) {
    if (window.location.pathname !== '/') {
      window.location.replace('/')
    } else {
      leaveRemoteGame(false)
    }
  } else {
    joinRemoteGame(gameID, false)
  }
}

window.addEventListener('popstate', handleURLChange)
handleURLChange()

render(<App />, document.querySelector('#app'))
