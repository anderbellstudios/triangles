import { test, expect, type Page } from '@playwright/test'
import { makeRandomIdentifier } from '../client/src/randomIdentifier'
import {
  expectCellToBe,
  expectCurrentGameID,
  expectCurrentTurn,
  expectHostGameToAlreadyExist,
  expectHostGameToBeOkay,
  expectJoinGameToBeOkay,
  expectJoinGameToNotExist,
  expectPlayingLocallyOrOnline,
  fillGameID,
  locateCell,
  newGame,
  pressConfirmJoin,
  pressCreateGame,
  pressHostGame,
  pressJoinGame,
  pressLeaveGame,
} from './utils'

test.describe('Online', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await locateCell(page, 1, 1).click()
    await locateCell(page, 1, 4).click()
    await locateCell(page, 4, 1).click()
    await locateCell(page, 4, 4).click()
  })

  const expectInitialBoard = async (page: Page) => {
    await expectCellToBe(page, 1, 1, 'cross')
    await expectCellToBe(page, 1, 4, 'circle')
    await expectCellToBe(page, 4, 1, 'triangle')
    await expectCellToBe(page, 4, 4, 'cross')
  }

  test('Host game', async ({ page }) => {
    await expectPlayingLocallyOrOnline(page, 'locally')
    const gameID = makeRandomIdentifier()

    await pressHostGame(page)
    await expectHostGameToBeOkay(page)
    await fillGameID(page, gameID)
    await expectHostGameToBeOkay(page)
    await pressCreateGame(page)

    await expectCurrentGameID(page, gameID)
    await expectPlayingLocallyOrOnline(page, 'online')

    await expectCurrentTurn(page, 'circle')
    await locateCell(page, 2, 2).click()

    await pressLeaveGame(page)
    await expectPlayingLocallyOrOnline(page, 'locally')

    await newGame(page)

    await pressHostGame(page)
    await fillGameID(page, gameID)
    await expectHostGameToAlreadyExist(page)
    await page.getByText('Join that game').click()

    await expectCurrentGameID(page, gameID)
    await expectPlayingLocallyOrOnline(page, 'online')

    await expectInitialBoard(page)
    await expectCellToBe(page, 2, 2, 'circle')
  })

  test('Join game with dialog', async ({ page }) => {
    await expectPlayingLocallyOrOnline(page, 'locally')
    const gameID1 = '1-' + makeRandomIdentifier()
    const gameID2 = '2-' + makeRandomIdentifier()

    await pressHostGame(page)
    await fillGameID(page, gameID1)
    await pressCreateGame(page)

    await expectPlayingLocallyOrOnline(page, 'online')
    await expectCurrentGameID(page, gameID1)

    const secondPage = await page.context().newPage()
    await secondPage.goto('http://localhost:3000/')

    await pressJoinGame(secondPage)
    await fillGameID(secondPage, gameID2)
    await expectJoinGameToNotExist(secondPage)
    await secondPage.getByText('Create it now').click()

    await expectPlayingLocallyOrOnline(secondPage, 'online')
    await expectCurrentGameID(secondPage, gameID2)
    await pressLeaveGame(secondPage)
    await expectPlayingLocallyOrOnline(secondPage, 'locally')

    await pressJoinGame(secondPage)
    await fillGameID(secondPage, gameID1)
    await expectJoinGameToBeOkay(secondPage)
    await pressConfirmJoin(secondPage)

    await expectPlayingLocallyOrOnline(secondPage, 'online')
    await expectCurrentGameID(secondPage, gameID1)

    await expectInitialBoard(secondPage)
  })

  test('Join game with URL', async ({ page }) => {
    await expectPlayingLocallyOrOnline(page, 'locally')
    const gameID = makeRandomIdentifier()

    await pressHostGame(page)
    await fillGameID(page, gameID)
    await pressCreateGame(page)

    await expectPlayingLocallyOrOnline(page, 'online')
    await expectCurrentGameID(page, gameID)

    const secondPage = await page.context().newPage()
    await secondPage.goto(`http://localhost:3000/game/${gameID}`)

    await expectPlayingLocallyOrOnline(secondPage, 'online')
    await expectCurrentGameID(secondPage, gameID)

    await expectInitialBoard(secondPage)
  })

  test('State synchronises between clients', async ({ page }) => {
    await expectPlayingLocallyOrOnline(page, 'locally')
    const gameID = makeRandomIdentifier()

    await pressHostGame(page)
    await fillGameID(page, gameID)
    await pressCreateGame(page)

    await expectPlayingLocallyOrOnline(page, 'online')
    await expectCurrentGameID(page, gameID)

    const secondPage = await page.context().newPage()
    await secondPage.goto(`http://localhost:3000/game/${gameID}`)

    await expectPlayingLocallyOrOnline(secondPage, 'online')
    await expectCurrentGameID(secondPage, gameID)

    // Circle in (2, 2) on first page
    await expectCurrentTurn(page, 'circle')
    await locateCell(page, 2, 2).click()

    // Takes effect on second page
    await expectCurrentTurn(secondPage, 'triangle')
    await expectCellToBe(secondPage, 2, 2, 'circle')

    // Triangle in (3, 3) on second page
    await expectCurrentTurn(secondPage, 'triangle')
    await locateCell(secondPage, 3, 3).click()

    // Takes effect on first page
    await expectCurrentTurn(page, 'cross')
    await expectCellToBe(page, 3, 3, 'triangle')
  })

  test('Pasting a join link', async ({ page }) => {
    await pressJoinGame(page)

    const input = page.getByLabel('Game ID').locator('visible=true')

    const pasteIntoInput = async (text: string) =>
      input.evaluate((input, text) => {
        const event = new ClipboardEvent('paste', {
          clipboardData: new DataTransfer(),
        })

        event.clipboardData!.setData('text/plain', text)

        input.dispatchEvent(event)
      }, text)

    await input.fill('before 1')
    await pasteIntoInput('https://anything.com:1234/game/my-game-id')
    await expect(input).toHaveValue('my-game-id')

    await input.fill('before 2')
    await pasteIntoInput('https://anything.com:1234/not-game/my-game-id')
    await expect(input).toHaveValue('before-2')
  })
})
