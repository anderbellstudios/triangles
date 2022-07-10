const path = require('path')
const express = require('express')
const http = require('http')
const { createClient } = require('redis')
const { mountAPI } = require('./src/api')
const { mountSocket } = require('./src/socket')

;(async () => {
  const app = express()
  const server = http.createServer(app)

  const redisClient = createClient({ url: process.env.REDIS_URL })
  const pubClient = redisClient.duplicate()
  const subClient = redisClient.duplicate()

  await Promise.all([
    redisClient.connect(),
    pubClient.connect(),
    subClient.connect(),
  ])

  const io = mountSocket(server, redisClient, pubClient, subClient)
  mountAPI(app, redisClient, io)

  const clientRoot = path.join(__dirname, '../client/dist')

  app.use(express.static(clientRoot))

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientRoot, 'index.html'))
  })

  const port = process.env.PORT || 3000

  server.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
})()
