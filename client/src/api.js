import wrappedFetch from './wrappedFetch'

const gameExists = gameID =>
  wrappedFetch(`/api/game/${gameID}`, {
    method: 'HEAD',
    acceptResponse: response => /200|404/.test(response.status),
  }).then(response => response.ok)

const uploadGame = (gameID, game) =>
  wrappedFetch(`/api/game/${gameID}`, {
    method: 'POST',
    body: JSON.stringify(game),
    headers: {
      'Content-Type': 'application/json',
    },
  })

export { gameExists, uploadGame }
