import consumer from './consumer'

const subscribe = props => (
  consumer.subscriptions.create(
    {
      channel: 'GameChannel',
      id: props.gameId,
    },

    {
      connected() {
        // Called when the subscription is ready for use on the server
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        props.onUpdate?.(data)
      },

      update(gameData) {
        this.send(gameData)
      }
    }
  )
)

export default {
  subscribe,
}
