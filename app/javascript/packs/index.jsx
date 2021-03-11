import React from 'react'
import ReactDOM from 'react-dom'
import Application from './Application'

document.addEventListener('DOMContentLoaded', () =>
  ReactDOM.render(
    <Application />,
    document.querySelector('#app'),
  )
)
