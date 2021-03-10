import React from 'react'
import ReactDOM from 'react-dom'
import Game from './Game'

const Application = () => (
  <div className="mx-auto">
    <h1>Triangles</h1>

    <div className="mt-5">
      <Game />
    </div>
  </div>
)

document.addEventListener('DOMContentLoaded', () =>
  ReactDOM.render(
    <Application />,
    document.querySelector('#app'),
  )
)
