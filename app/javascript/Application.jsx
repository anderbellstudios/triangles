import React from 'react'
import ReactDOM from 'react-dom'
import Rails from '@rails/ujs'
import { Popover } from 'bootstrap'
import GameChannel from './channels/game_channel'
import Game from './Game'
import CopyButton from './CopyButton'

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.joinGameLinkRef = React.createRef()
    this.gameRef = React.createRef()
    this.jitsiMeetContainerRef = React.createRef()

    this.state = {
      onlineGame: this.props.gameId !== '',
      gameId: this.props.gameId,
      gameSubscription: null,
      shouldBeConnected: false,
      connected: false,
      windowUnloading: false,
      jitsiStarted: false,
    }
  }

  componentDidMount() {
    if (this.state.onlineGame) {
      this.subscribeToGame()
    } else {
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
                this.setGameId(matches[0])
              }
            }
          } />,
        popoverContent
      )

      popoverTarget.addEventListener('shown.bs.popover', () => {
        inputRef.current.focus()
      })
    }

    window.addEventListener('beforeunload', () => this.setState({ windowUnloading: true }))
  }

  createGame() {
    return fetch(this.props.gamesPath, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': Rails.csrfToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        game: {
          data: JSON.stringify(this.gameRef.current.gameData),
        },
      }),
    })
      .then(response => response.json())
      .then(game => this.setGameId(game.id))
      .catch(console.error)
  }

  setGameId(gameId) {
    window.history.replaceState({}, '', `/${gameId}`)

    this.setState({
      onlineGame: true,
      gameId: gameId,
    }, this.subscribeToGame.bind(this))
  }

  subscribeToGame() {
    this.setState({
      gameSubscription: GameChannel.subscribe({
        gameId: this.state.gameId,
        onConnect: this.handleConnect.bind(this),
        onDisconnect: this.handleDisconnect.bind(this),
        onUpdate: data => this.handleRemoteUpdate(data),
      }),
    })
  }

  handleConnect() {
    fetch(`/games/${this.state.gameId}`)
      .then(response => response.json())
      .then(game => {
        this.handleRemoteUpdate(JSON.parse(game.data))

        this.setState({
          shouldBeConnected: true,
          connected: true,
        })
      })
      .catch(console.error)
  }

  handleDisconnect() {
    this.setState({
      shouldBeConnected: true,
      connected: false,
    })
  }

  handleLocalUpdate(gameData) {
    if (this.state.onlineGame) {
      this.state.gameSubscription.update(gameData)
    }
  }

  handleRemoteUpdate(gameData) {
    this.gameRef.current.setGameData(gameData)
  }

  startJitsi() {
    const container = this.jitsiMeetContainerRef.current
    container.innerHTML = ''

    const api = new JitsiMeetExternalAPI('meet.jit.si', {
      roomName: `triangles-${this.state.gameId}`,
      parentNode: container,
    })

    container.querySelector('iframe').style.height = '80vh'

    this.setState({
      jitsiStarted: true,
    })

    api.addEventListener('videoConferenceLeft', () => this.setState({
      jitsiStarted: false,
    }))

    api.addEventListener('readyToClose', () => {
      container.innerHTML = ''
    })
  }

  render() {
    return (
      <>
        <div className="container-fluid" style={{ maxWidth: '576px' }}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb flex-nowrap mb-2">
              {
                this.state.onlineGame
                  ? (
                    <>
                      <li key="game" className="breadcrumb-item">
                        <a href="/" className="text-muted">Game</a>
                      </li>

                      <li key="game-id" className="breadcrumb-item active text-muted text-truncate">
                        {this.state.gameId}
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

          {
            (this.state.shouldBeConnected && !this.state.connected && !this.state.windowUnloading) && (
              <div className="alert alert-danger" role="alert">
                <strong>Disconnected.</strong> Trying to reconnect&hellip; <div className="spinner-border spinner-border-sm"></div>
              </div>
            )
          }

          <h1>
            <a href="/" className="text-reset text-decoration-none">Triangles</a>
          </h1>

          <p className="lead">
            3 players; 3 shapes; 3 in a line
          </p>

          <div className="mt-5">
            <Game
              ref={this.gameRef}
              disabled={this.state.onlineGame && !this.state.connected}
              onUpdate={this.handleLocalUpdate.bind(this)} />
          </div>

          <h2 className="mt-5">Play with friends</h2>

          {
            this.state.onlineGame
              ? (
                <>
                  <p className="lead">Anyone with the link can play live</p>

                  <div className="d-grid d-md-block gap-2">
                    <CopyButton copyText={() => window.location.href} className="btn btn-dark">
                      Copy link
                    </CopyButton>

                    {' '}

                    <button className="btn btn-dark" onClick={this.startJitsi.bind(this)} disabled={this.state.jitsiStarted}>
                      Join Jitsi Meet call
                    </button>
                  </div>
                </>
              )

              : (
                <>
                  <p className="lead">You are playing locally</p>

                  <div className="d-grid d-md-block gap-2">
                    <button className="btn btn-dark" onClick={this.createGame.bind(this)}>
                      Play online
                    </button>
                  </div>
                </>
              )
          }
        </div>

        <div className="container">
          <div ref={this.jitsiMeetContainerRef} className="mt-5"></div>
        </div>
      </>
    )
  }
}

export default Application
