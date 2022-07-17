import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import * as redisHelper from './redisHelper.js'
import { sanitiseGameIDForInternalUse } from '../../common/gameIDUtils.js'

const mountSocket = (server, redisClient, pubClient, subClient) => {
  const io = new Server(server)

  io.adapter(createAdapter(pubClient, subClient))

  io.on('connection', socket => {
    const gameID = socket.handshake.query.gameID

    socket.join(sanitiseGameIDForInternalUse(gameID))

    socket.on('game-updated', async game => {
      await redisHelper.setGame(redisClient, gameID, JSON.stringify(game))
      socket.to(sanitiseGameIDForInternalUse(gameID)).emit('game-updated', game)
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

export default mountSocket
