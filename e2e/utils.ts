import { Page, expect } from '@playwright/test'
import { capitalise } from '../client/src/capitalise'
import { Shape } from '../common/types'

export const expectCurrentTurn = async (page: Page, player: Shape) => {
  await expect(
    page.getByLabel(`Current turn is ${capitalise(player)}`)
  ).toBeVisible()
}

export const locateCell = (
  page: Page,
  row: 1 | 2 | 3 | 4,
  col: 1 | 2 | 3 | 4
) => {
  const index = (row - 1) * 4 + col - 1
  return page.getByTestId('grid-cell').nth(index)
}

export const expectCellToBe = async (
  page: Page,
  row: 1 | 2 | 3 | 4,
  col: 1 | 2 | 3 | 4,
  shape: Shape | null
) => {
  const cell = locateCell(page, row, col)

  if (shape === null) {
    await expect(cell).toBeEnabled()
    return
  }

  await expect(cell).toHaveAttribute(
    'aria-label',
    `Square with ${capitalise(shape)}`
  )
}

export const winWithFirstPlayer = async (page: Page) => {
  await locateCell(page, 1, 1).click() // First
  await locateCell(page, 1, 2).click()
  await locateCell(page, 1, 3).click()
  await locateCell(page, 2, 1).click() // First
  await locateCell(page, 2, 2).click()
  await locateCell(page, 2, 3).click()
  await locateCell(page, 3, 1).click() // First
}

export const drawGame = async (page: Page) => {
  await locateCell(page, 1, 1).click()
  await locateCell(page, 1, 2).click()
  await locateCell(page, 1, 3).click()
  await locateCell(page, 1, 4).click()
  await locateCell(page, 2, 4).click()
  await locateCell(page, 3, 4).click()
  await locateCell(page, 4, 4).click()
  await locateCell(page, 4, 3).click()
  await locateCell(page, 4, 2).click()
  await locateCell(page, 4, 1).click()
  await locateCell(page, 3, 1).click()
  await locateCell(page, 2, 1).click()
  await locateCell(page, 2, 2).click()
  await locateCell(page, 2, 3).click()
  await locateCell(page, 3, 3).click()
  await locateCell(page, 3, 2).click()
}

export const expectWinner = async (page: Page, winner: Shape) => {
  await expect(page.getByText(`${capitalise(winner)} wins!`)).toBeVisible()
}

export const expectDraw = async (page: Page) => {
  await expect(page.getByText('Its a draw!')).toBeVisible()
}

export const playAgain = async (page: Page) => {
  await page.getByText('Play again', { exact: true }).click()
}

export const newGame = async (page: Page) => {
  await page.getByText('New game', { exact: true }).click()
}

export const undo = async (page: Page) => {
  await page.getByLabel('Undo').click()
}
