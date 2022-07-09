const { Server } = require('socket.io')
const { createAdapter } = require('@socket.io/redis-adapter')
const { createClient } = require('redis')

module.exports.mountSocket = async server => {
  const io = new Server(server)

  const pubClient = createClient({ url: process.env.REDIS_URL })
  const subClient = pubClient.duplicate()

  await Promise.all([
    pubClient.connect(),
    subClient.connect(),
  ])

  io.adapter(createAdapter(pubClient, subClient))

  io.on('connection', socket => {
    const gameID = socket.handshake.query.gameID
    socket.join(gameID)

    socket.on('game-updated', game => {
      socket.to(gameID).emit('game-updated', game)
    })
  })
}
