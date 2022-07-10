const { Server } = require('socket.io')
const { createAdapter } = require('@socket.io/redis-adapter')
const redisHelper = require('./redisHelper')

module.exports.mountSocket = (server, redisClient, pubClient, subClient) => {
  const io = new Server(server)

  io.adapter(createAdapter(pubClient, subClient))

  io.on('connection', socket => {
    const gameID = socket.handshake.query.gameID

    socket.join(gameID)

    socket.on('game-updated', async game => {
      await redisHelper.setGame(redisClient, gameID, JSON.stringify(game))
      socket.to(gameID).emit('game-updated', game)
    })

    socket.on('request-game', async () => {
      const gameData = await redisHelper.getGame(redisClient, gameID)

      if (gameData === null) {
        socket.emit('game-not-found')
      } else {
        socket.emit('game-updated', JSON.parse(gameData))
      }
    })
  })

  return io
}
