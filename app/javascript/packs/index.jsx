import React from 'react'
import ReactDOM from 'react-dom'
import Game from './Game'

const Application = () => (
  <div className="mx-auto">
    <h1>Triangles</h1>

    <p className="lead">
      3 players; 3 shapes; 3 in a row
    </p>

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
