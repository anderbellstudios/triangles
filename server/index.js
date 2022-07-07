const path = require('path')
const express = require('express')
const api = require('./src/api')

const app = express()

app.use('/api', api)

const clientRoot = path.join(__dirname, '../client/dist')

app.use(express.static(clientRoot))

app.get('*', (req, res) => {
  res.sendFile(path.join(clientRoot, 'index.html'))
})

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
