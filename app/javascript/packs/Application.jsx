import React from 'react'
import Rails from '@rails/ujs'
import Game from './Game'

import GameChannel from '../channels/game_channel'

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.gameRef = React.createRef()

    this.state = {
      gameSubscription: null,
    }
  }

  componentDidMount() {
    const gamePromise = (
      this.props.gamePath === ''
      ? this.createGame()
      : this.fetchGame()
    )

    gamePromise
      .then(game => {
        this.handleRemoteUpdate(JSON.parse(game.data))
        this.subscribeToGame(game)
      })
      .catch(console.error)
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
      .then(game => {
        window.history.replaceState({}, '', `/${game.id}`)
        return game
      })
  }

  fetchGame() {
    return fetch(this.props.gamePath)
      .then(response => response.json())
  }

  subscribeToGame(game) {
    this.setState({
      gameSubscription: GameChannel.subscribe({
        gameId: game.id,
        onUpdate: data => this.handleRemoteUpdate(data),
      }),
    })
  }

  handleLocalUpdate(gameData) {
    this.state.gameSubscription.update(gameData)
  }

  handleRemoteUpdate(gameData) {
    this.gameRef.current.setGameData(gameData)
  }

  render() {
    return (
      <div className="container"  style={{ maxWidth: '60vh' }}>
        <div className="row justify-content-between align-items-center">
          <h1 className="col mb-2">Triangles</h1>

          <div className="col-auto mb-2">
            <a href="/" className="btn btn-sm btn-dark">New game</a>
          </div>
        </div>

        <p className="lead">
          3 players; 3 shapes; 3 in a row
        </p>

        <div className="mt-5 mb-3">
          <Game ref={this.gameRef} onUpdate={this.handleLocalUpdate.bind(this)} />
        </div>
      </div>
    )
  }
}

export default Application
