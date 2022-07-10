module.exports.gameExists = (client, gameID) => client.exists(`game:${gameID}`)

module.exports.getGame = (client, gameID) => client.get(`game:${gameID}`)

module.exports.setGame = async (client, gameID, game) => {
  await client.set(`game:${gameID}`, game)
  return client.expire(`game:${gameID}`, 60 * 60 * 24)
}
