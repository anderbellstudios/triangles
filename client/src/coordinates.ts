const COLUMN_NAMES = 'ABCD'

export const getCoordinates = (cellIndex: number) => {
  const columnName = COLUMN_NAMES[cellIndex % 4]
  const rowNumber = Math.floor(cellIndex / 4) + 1
  return `${columnName}${rowNumber}`
}
