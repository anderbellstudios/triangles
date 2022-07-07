const express = require('express')

const api = express.Router()

api.get('/hello', (req, res) => {
  res.send('Hello World!')
})

module.exports = api
