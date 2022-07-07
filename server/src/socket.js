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
    const channel = socket.handshake.query.channel
    socket.join(channel)

    socket.on('message', message => {
      socket.to(channel).emit('message', message)
    })
  })
}
