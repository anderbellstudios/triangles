import { ServerOptions, Server as SocketServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { createAdapter } from '@socket.io/redis-adapter'
import * as redisHelper from './redisHelper'
import { sanitiseGameIDForInternalUse } from '../../common/gameIDUtils'
import { RedisClient } from './types'

export const mountSocket = (
  server: HTTPServer,
  redisClient: RedisClient,
  pubClient: RedisClient,
  subClient: RedisClient
): SocketServer => {
  const io = new SocketServer(server, {
    pingInterval: 2000,
    pingTimeout: 1000,
  } as Partial<ServerOptions>)

  io.adapter(createAdapter(pubClient, subClient))

  io.on('connection', socket => {
    const gameID = socket.handshake.query.gameID as string

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
        socket.emit('request-game', JSON.parse(gameData))
      }
    })
  })

  return io
}
