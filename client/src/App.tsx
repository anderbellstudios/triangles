import { h } from 'preact'
import { H1, H2, H3, Paragraph, LeadParagraph } from './typography'
import { GameArea } from './GameArea'
import { OnlineControls } from './OnlineControls'
import { AIControls } from './AIControls'
import { useViewport } from './useViewport'
import { useTryingToConnect } from './useTryingToConnect'

export const App = () => {
  const { viewportWidth } = useViewport()
  const twoColumnLayout = viewportWidth >= 768

  const [tryingToConnect, forcefullyDisconnected] = useTryingToConnect()

  return (
    <main class="mx-auto max-w-screen-lg">
      <H1>Triangles</H1>

      <LeadParagraph class="mb-16">
        A strategic Tic-Tac-Toe variant for up to 3 players
      </LeadParagraph>

      {tryingToConnect && forcefullyDisconnected && (
        <div
          class="mb-8 rounded-lg bg-red-600 p-4 text-white"
          aria-live="assertive"
        >
          The connection has been interrupted. Trying to reconnect
          <span class="animate-ellipses" aria-hidden="true" />
        </div>
      )}

      <div class="align-center mb-16 flex flex-col justify-between gap-8 md:flex-row">
        <GameArea {...{ twoColumnLayout }} />

        <div class="md:ml-auto">
          <div class="space-y-8 md:max-w-sm">
            <OnlineControls />
            <AIControls />
          </div>
        </div>
      </div>

      <div class="mb-16 text-lg">
        <H2>How to play</H2>

        <Paragraph>
          Just like in Tic-Tac-Toe, your goal is to get 3 of your shape in a
          row. Unlike in Tic-Tac-Toe, the grid has 4 rows and columns, and there
          are 3 shapes—one for each player.
        </Paragraph>

        <Paragraph>
          Each player takes turns clicking or tapping an empty square on the
          grid to place their shape. The first player to get 3 in a row wins.
        </Paragraph>

        <H3 class="mt-8">Play online</H3>

        <Paragraph>
          You can play locally with people in the same room as you, or you can{' '}
          play online over the internet. To play online, press Host game, choose
          a game ID, and press Create game.
        </Paragraph>

        <Paragraph>
          Other players can join your game by pressing Join game and entering
          the game ID, or you can press Copy link and send them a URL to join
          automatically.
        </Paragraph>

        <H3 class="mt-8">Compensate for your lack of friends</H3>

        <Paragraph>
          If you don't have 2 friends to play against, you can set one or more
          players to be controlled by the computer. Use the switches under Play
          against computer to select which players the computer controls.
        </Paragraph>

        <Paragraph>
          Be warned: The computer knows all the best stategies and plays to win.
          If you can beat the computer more than 33% of the time, you're a{' '}
          certified Triangles expert.
        </Paragraph>
      </div>

      <Paragraph>
        Game by{' '}
        <a href="https://anderbell.studio/" target="_blank" rel="noopener">
          Anderbell Studios
        </a>{' '}
        &middot;{' '}
        <a
          href="https://github.com/anderbellstudios/triangles"
          target="_blank"
          rel="noopener"
        >
          View source code
        </a>
      </Paragraph>
    </main>
  )
}
