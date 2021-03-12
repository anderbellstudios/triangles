import React from 'react'
import ReactDOM from 'react-dom'
import Application from './Application'

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app')

  ReactDOM.render(
    <Application
      gamesPath={app.dataset.gamesPath}
      gamePath={app.dataset.gamePath} />,
    app
  )
})
