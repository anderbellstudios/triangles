import React from 'react'
import ReactDOM from 'react-dom'
import Application from './Application'

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app')

  ReactDOM.render(
    <Application
      gameId={app.dataset.gameId}
      gamesPath={app.dataset.gamesPath} />,
    app
  )
})
