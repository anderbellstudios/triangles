const path = require('path')
const express = require('express')
const http = require('http')
const api = require('./src/api')
const { mountSocket } = require('./src/socket')

const app = express()
const server = http.createServer(app)

app.use('/api', api)

const clientRoot = path.join(__dirname, '../client/dist')

app.use(express.static(clientRoot))

app.get('*', (req, res) => {
  res.sendFile(path.join(clientRoot, 'index.html'))
})

mountSocket(server)

const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
