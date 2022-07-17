const maxGameIDLength = 32

const sanitiseGameID = gameID => gameID
  .replaceAll(/[\s/.%]/g, '-')
  .slice(0, maxGameIDLength)

const sanitiseGameIDForInternalUse = gameID => sanitiseGameID(gameID)
  .toLowerCase()

export {
  maxGameIDLength,
  sanitiseGameID,
  sanitiseGameIDForInternalUse,
}
