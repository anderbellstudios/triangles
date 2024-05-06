import { test, expect } from '@playwright/test'
import {
  drawGame,
  expectCellToBe,
  expectCurrentTurn,
  expectWinner,
  locateCell,
  newGame,
  playAgain,
  undo,
  winWithFirstPlayer,
} from './utils'

test.describe('Gameplay', () => {
  test('Clicking cells', async ({ page }) => {
    await page.goto('http://localhost:3000/')

    await expectCurrentTurn(page, 'cross')
    await locateCell(page, 1, 1).click()
    await expectCellToBe(page, 1, 1, 'cross')
    await expect(locateCell(page, 1, 1)).toBeDisabled()

    await expectCurrentTurn(page, 'circle')
    await locateCell(page, 1, 2).click()
    await expectCellToBe(page, 1, 2, 'circle')
    await expect(locateCell(page, 1, 2)).toBeDisabled()

    await expectCurrentTurn(page, 'triangle')
    await locateCell(page, 1, 3).click()
    await expectCellToBe(page, 1, 3, 'triangle')
    await expect(locateCell(page, 1, 3)).toBeDisabled()

    await expectCurrentTurn(page, 'cross')
    await locateCell(page, 1, 4).click()
    await expectCellToBe(page, 1, 4, 'cross')
    await expect(locateCell(page, 1, 4)).toBeDisabled()
  })

  test('Winning the game', async ({ page }) => {
    await page.goto('http://localhost:3000/')

    await expectCurrentTurn(page, 'cross')
    await winWithFirstPlayer(page)
    await expectWinner(page, 'cross')

    await playAgain(page)

    await expectCurrentTurn(page, 'circle')
    await winWithFirstPlayer(page)
    await expectWinner(page, 'circle')

    await playAgain(page)

    await expectCurrentTurn(page, 'triangle')
    await winWithFirstPlayer(page)
    await expectWinner(page, 'triangle')
  })

  test('Drawing the game', async ({ page }) => {
    await page.goto('http://localhost:3000/')

    await expectCurrentTurn(page, 'cross')
    await drawGame(page)
    await expect(page.getByText('Draw!')).toBeVisible()
    await playAgain(page)
  })

  test('New game', async ({ page }) => {
    await page.goto('http://localhost:3000/')

    await expectCurrentTurn(page, 'cross')
    await locateCell(page, 1, 1).click()
    await expectCellToBe(page, 1, 1, 'cross')
    await locateCell(page, 1, 2).click()
    await expectCellToBe(page, 1, 2, 'circle')

    await newGame(page)

    await expectCurrentTurn(page, 'cross')
    await expectCellToBe(page, 1, 1, null)
    await expectCellToBe(page, 1, 2, null)
  })

  test('Undo', async ({ page }) => {
    await page.goto('http://localhost:3000/')

    await expectCurrentTurn(page, 'cross')
    await locateCell(page, 1, 1).click()
    await expectCellToBe(page, 1, 1, 'cross')

    await expectCurrentTurn(page, 'circle')
    await locateCell(page, 1, 2).click()
    await expectCellToBe(page, 1, 2, 'circle')

    await expectCurrentTurn(page, 'triangle')
    await undo(page)

    await expectCurrentTurn(page, 'circle')
    await expectCellToBe(page, 1, 2, null)
    await locateCell(page, 1, 3).click()
    await expectCellToBe(page, 1, 3, 'circle')

    await expectCurrentTurn(page, 'triangle')
  })
})
