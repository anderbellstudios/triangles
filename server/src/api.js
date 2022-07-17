const express = require('express')
const redisHelper = require('./redisHelper')

module.exports.mountAPI = (app, redisClient, io) => {
  const api = express.Router()

  api.use(express.json())

  api.head('/game/:id', async (req, res) => {
    const exists = await redisHelper.gameExists(redisClient, req.params.id)
    res.status(exists ? 200 : 404).send()
  })

  api.post('/game/:id', async (req, res) => {
    const gameID = req.params.id

    if (await redisHelper.gameExists(redisClient, gameID)) {
      res.status(200).send()
      return
    }

    const game = req.body
    await redisHelper.setGame(redisClient, gameID, JSON.stringify(game))
    io.to(gameID).emit('game-updated', game)

    res.status(201).send()
  })

  app.use('/api', api)
}
