import {RedisClient} from './types'
import { sanitiseGameIDForInternalUse } from '../../common/gameIDUtils'

const keyForGameID = (gameID: string) => `game:${sanitiseGameIDForInternalUse(gameID)}`

export const gameExists = (client: RedisClient, gameID: string) => client.exists(keyForGameID(gameID))

export const getGame = (client: RedisClient, gameID: string) => client.get(keyForGameID(gameID))

export const setGame = async (client: RedisClient, gameID: string, game: string) => {
  const key = keyForGameID(gameID)
  await client.set(key, game)
  return client.expire(key, 60 * 60 * 24)
}
