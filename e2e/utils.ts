import { type Page, expect } from '@playwright/test'
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

export const expectPlayingLocallyOrOnline = async (
  page: Page,
  state: 'locally' | 'online'
) => {
  await expect(page.getByText(`You are playing ${state}`)).toBeVisible()
}

export const expectCurrentGameID = async (
  page: Page,
  gameID: string | null
) => {
  if (gameID === null) {
    await expect(page.getByTestId('current-game-id')).toBeHidden()
    return
  }

  await expect(page.getByTestId('current-game-id')).toHaveText(gameID)
}

export const pressHostGame = async (page: Page) => {
  await page.getByRole('button', { name: 'Host game' }).click()
}

export const pressJoinGame = async (page: Page) => {
  await page.getByRole('button', { name: 'Join game' }).click()
}

export const pressLeaveGame = async (page: Page) => {
  await page.getByRole('button', { name: 'Leave game' }).click()
}

export const pressCreateGame = async (page: Page) => {
  await page.getByRole('button', { name: 'Create game' }).click()
}

export const pressConfirmJoin = async (page: Page) => {
  await page.getByRole('button', { name: 'Join', exact: true }).click()
}

export const fillGameID = async (page: Page, gameID: string) => {
  await page.getByLabel('Game ID').locator('visible=true').fill(gameID)
}

export const expectHostGameToBeOkay = async (page: Page) => {
  await expect(
    page.getByText('Enter an ID that people will use to join your game')
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Create game' })).toBeEnabled()
}

export const expectHostGameToAlreadyExist = async (page: Page) => {
  await expect(page.getByText('That ID is already in use')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Create game' })).toBeDisabled()
}

export const expectJoinGameToBeOkay = async (page: Page) => {
  await expect(
    page.getByText('Looks good to me! Click Join to confirm.')
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Join', exact: true })
  ).toBeEnabled()
}

export const expectJoinGameToNotExist = async (page: Page) => {
  await expect(page.getByText('No game with that ID exists.')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Join', exact: true })
  ).toBeDisabled()
}
