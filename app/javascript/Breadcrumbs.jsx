import React from 'react'
import ReactDOM from 'react-dom'
import { Popover } from 'bootstrap'

class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props)

    this.joinGameLinkRef = React.createRef()
  }

  componentDidMount() {
    if (!this.props.onlineGame) {
      const popoverTarget = this.joinGameLinkRef.current
      const popoverContent = document.createElement('div')
      const inputRef = React.createRef()

      const popover = new Popover(popoverTarget, {
        container: 'body',
        html: true,
        sanitize: false,
        content: popoverContent,
      })

      ReactDOM.render(
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          placeholder="Game link"
          onChange={
            event => {
              const { value } = event.target
              const matches = value.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/)

              if (matches !== null) {
                popover.hide()
                this.props.onGameIdSelected(matches[0])
              }
            }
          } />,
        popoverContent
      )

      popoverTarget.addEventListener('shown.bs.popover', () => {
        inputRef.current.focus()
      })
    }
  }

  render() {
    return (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb flex-nowrap mb-2">
          {
            this.props.onlineGame
              ? (
                <>
                  <li key="game" className="breadcrumb-item">
                    <a href="/" className="text-muted">Game</a>
                  </li>

                  <li key="game-id" className="breadcrumb-item active text-muted text-truncate">
                    {this.props.gameId}
                  </li>
                </>
              )
              : (
                <li key="join-game" className="breadcrumb-item active">
                  <a
                    ref={this.joinGameLinkRef}
                    tabIndex="0"
                    role="button"
                    className="text-muted">
                    Join game
                  </a>
                </li>
              )
          }
        </ol>
      </nav>
    )
  }
}

export default Breadcrumbs
