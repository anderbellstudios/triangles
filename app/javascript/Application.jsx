import React from 'react'
import ReactDOM from 'react-dom'
import niceware from 'niceware'
import GameChannel from './channels/game_channel'
import PopPixieAdvert from './PopPixieAdvert'
import FeedbackForm from './FeedbackForm'
import Breadcrumbs from './Breadcrumbs'
import CopyButton from './CopyButton'
import GameComponent from './GameComponent'
import Game from './game'
import AI from './ai'

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.gameComponentRef = React.createRef()
    this.jitsiMeetContainerRef = React.createRef()

    this.game = new Game({
      onChange: () => this.gameComponentRef.current.forceUpdate(),
      onLocalChange: this.handleLocalChange.bind(this),
    })

    this.ai = new AI({
      game: this.game,
      isDisabled: this.gameDisabled.bind(this),
    })

    this.state = {
      onlineGame: this.props.gameId !== '',
      gameId: this.props.gameId,
      gameSubscription: null,
      showOfflineMessage: false,
      failedToCreateGame: false,
      shouldBeConnected: false,
      connected: false,
      windowUnloading: false,
      jitsiStarted: false,
    }
  }

  componentDidMount() {
    if (this.state.onlineGame) {
      this.subscribeToGame()
    }

    window.addEventListener('beforeunload', () => this.setState({ windowUnloading: true }))
  }

  createGame() {
    this.setState({
      failedToCreateGame: false,
    }, () => {
      return fetch(this.props.gamesPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          game: {
            id: niceware.generatePassphrase(8).map(word => {
              const [c, ...cs] = word
              return [c.toUpperCase(), ...cs].join('')
            }).join(''),
            data: JSON.stringify(this.game.serialise()),
          },
        }),
      })
        .then(response => response.json())
        .then(game => this.setGameId(game.id))
        .catch(() => this.setState({
          failedToCreateGame: true,
        }))
    })
  }

  gameExists(id) {
    return fetch(`/games/${id}`, {
      method: 'HEAD',
    })
      .then(response => response.status === 200)
  }

  setGameId(gameId) {
    window.history.replaceState({}, '', `/${gameId}`)

    this.setState({
      onlineGame: true,
      gameId: gameId,
    }, this.subscribeToGame.bind(this))
  }

  subscribeToGame() {
    if (navigator.onLine) {
      this.setState({
        gameSubscription: GameChannel.subscribe({
          gameId: this.state.gameId,
          onConnect: this.handleConnect.bind(this),
          onDisconnect: this.handleDisconnect.bind(this),
          onUpdate: data => this.handleRemoteChange(data),
        }),
      })
    } else {
      this.setState({
        showOfflineMessage: true,
      })
    }
  }

  gameDisabled() {
    return this.state.onlineGame && !this.state.connected
  }

  handleConnect() {
    fetch(`/games/${this.state.gameId}`)
      .then(response => response.json())
      .then(game => {
        this.handleRemoteChange(JSON.parse(game.data))

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

  handleLocalChange(gameData) {
    if (this.state.onlineGame) {
      this.state.gameSubscription.update(gameData)
    }

    this.ai.gameChanged()
  }

  handleRemoteChange(gameData) {
    this.game.deserialise(gameData)
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
          <PopPixieAdvert />

          {false && (
            <FeedbackForm
              formVersion="v1"
              title="How did you find out about Triangles?"
              description="Got a moment? Let us know how you discovered Triangles. We'd love to hear from you!" />
          )}

          <Breadcrumbs
            onlineGame={this.state.onlineGame}
            gameId={this.state.gameId}
            onGameIdChange={(id, callback) => {
              this.gameExists(id).then(exists => {
                exists && this.setGameId(id)
                callback(exists)
              })
            }} />

          {
            this.state.showOfflineMessage && (
              <div className="alert alert-danger" role="alert">
                <p><strong>Cannot join game.</strong> Your internet connection is offline.</p>

                <div className="d-grid d-md-block gap-2">
                  <button className="btn btn-danger" onClick={() => window.location.reload()}>
                    Retry
                  </button>

                  {' '}

                  <a className="btn btn-danger" href="/">
                    Play offline
                  </a>
                </div>
              </div>
            )
          }

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
            <GameComponent
              ref={this.gameComponentRef}
              game={this.game}
              disabled={this.gameDisabled()} />
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
                    {
                      this.state.failedToCreateGame && (
                        <div className="alert alert-danger" role="alert">
                          <strong>Failed to share game.</strong> Make sure your internet connection is online.
                        </div>
                      )
                    }

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
