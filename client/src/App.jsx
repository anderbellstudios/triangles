import { h } from 'preact'
import { H1, H2, H3, Paragraph, LeadParagraph } from './typography'
import GameArea from './GameArea'
import OnlineControls from './OnlineControls'
import AIControls from './AIControls'
import useViewport from './useViewport'
import useTryingToConnect from './useTryingToConnect'

const App = () => {
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

      <div class="text-lg">
        <H2>How to play</H2>

        <Paragraph>
          Just like in Tic-Tac-Toe, your goal is to get{' '}
          <strong>3 of your shape in a row</strong>. Unlike in Tic-Tac-Toe, the
          grid has <strong>4 rows and columns</strong>, and there are{' '}
          <strong>3 shapes</strong>—one for each player.
        </Paragraph>

        <Paragraph>
          Each player takes turns clicking or tapping an empty square on the
          grid to place their shape. The first player to get{' '}
          <strong>3 in a row wins</strong>.
        </Paragraph>

        <H3 class="mt-8">Play online</H3>

        <Paragraph>
          You can play locally with people in the same room as you, or you can{' '}
          <strong>play online</strong> over the internet. To play online, press{' '}
          <strong>Host game</strong>, choose a game ID, and press{' '}
          <strong>Create game</strong>.
        </Paragraph>

        <Paragraph>
          Other players can join your game by pressing{' '}
          <strong>Join game</strong> and entering the game ID, or you can press{' '}
          <strong>Copy link</strong> and send them a URL to join automatically.
        </Paragraph>

        <H3 class="mt-8">Compensate for your lack of friends</H3>

        <Paragraph>
          If you <strong>don't have 2 friends</strong> to play against, you can
          set one or more players to be{' '}
          <strong>controlled by the computer</strong>. Use the switches under{' '}
          <strong>Play against computer</strong> to select which players the
          computer controls.
        </Paragraph>

        <Paragraph>
          Be warned: The computer knows all the <strong>best stategies</strong>{' '}
          and plays to win. If you can beat the computer{' '}
          <strong>more than 33% of the time</strong>, you're a{' '}
          <strong>certified Triangles expert</strong>.
        </Paragraph>
      </div>
    </main>
  )
}

export default App
