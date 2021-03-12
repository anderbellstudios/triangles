import consumer from './consumer'

const subscribe = props => (
  consumer.subscriptions.create(
    {
      channel: 'GameChannel',
      id: props.gameId,
    },

    {
      connected() {
        props.onConnect?.()
      },

      disconnected() {
        props.onDisconnect?.()
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
