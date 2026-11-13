import { Move } from '../../common/types'

const COLUMN_NAMES = 'ABCD'

export const getCoordinates = (move: Move) => {
  const columnName = COLUMN_NAMES[move % 4]
  const rowNumber = Math.floor(move / 4) + 1
  return `${columnName}${rowNumber}`
}
