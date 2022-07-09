import { h, render } from 'preact'
import '@12joan/preact-hint/dist/style.css'
import App from './app'
import './index.css'
import './onlinePlayAdapter'

render(<App />, document.querySelector('#app'))
