import { sanitiseGameIDForInternalUse } from '../../common/gameIDUtils.js'

const keyForGameID = gameID => `game:${sanitiseGameIDForInternalUse(gameID)}`

const gameExists = (client, gameID) => client.exists(keyForGameID(gameID))

const getGame = (client, gameID) => client.get(keyForGameID(gameID))

const setGame = async (client, gameID, game) => {
  const key = keyForGameID(gameID)
  await client.set(key, game)
  return client.expire(key, 60 * 60 * 24)
}

export { gameExists, getGame, setGame }
