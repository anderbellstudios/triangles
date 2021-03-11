import consumer from './consumer'

const actionListeners = {}

const gameChannel = consumer.subscriptions.create('GameChannel', {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    const { action } = data

    actionListeners[action]?.forEach(l => l(data))
  },

  updateGame(gameData) {
    this.perform('update_game', { game: gameData })
  },

  addActionListener(action, callback) {
    actionListeners[action] = actionListeners[action] || []
    actionListeners[action].push(callback)
  }
})

export default gameChannel
