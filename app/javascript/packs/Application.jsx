import React from 'react'
import Game from './Game'

import gameChannel from '../channels/game_channel'

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.gameRef = React.createRef()
  }

  componentDidMount() {
    gameChannel.addActionListener('update_game', (data) => this.handleRemoteUpdate(data.game))
  }

  handleLocalUpdate(gameData) {
    gameChannel.updateGame(gameData)
  }

  handleRemoteUpdate(gameData) {
    this.gameRef.current.setGameData(gameData)
  }

  render() {
    return (
      <div className="mx-auto">
        <h1>Triangles</h1>

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
