export const maxGameIDLength = 32

export const sanitiseGameID = (gameID: string) => gameID
  .replace(/[\s/.%]/g, '-')
  .slice(0, maxGameIDLength)

export const sanitiseGameIDForInternalUse = (gameID: string) => sanitiseGameID(gameID)
  .toLowerCase()
