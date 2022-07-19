import { h } from 'preact'
import { H1, H2, Paragraph, LeadParagraph } from './typography'
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

      <LeadParagraph class="mb-8">
        3 players; 3 shapes; 3 in a line
      </LeadParagraph>

      {tryingToConnect && forcefullyDisconnected && (
        <div class="bg-red-600 text-white rounded-lg p-4 mb-8" aria-live="assertive">
          The connection has been interrupted. Trying to reconnect
          <span class="animate-ellipses" aria-hidden="true" />
        </div>
      )}

      <div class="align-center mb-8 flex flex-col justify-between gap-8 md:flex-row">
        <GameArea {...{ twoColumnLayout }} />

        <div class="md:ml-auto">
          <div class="space-y-8 md:max-w-sm">
            <OnlineControls />
            <AIControls />
          </div>
        </div>
      </div>

      <H2>How to play</H2>

      <Paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Paragraph>
      <Paragraph>Duis non lectus eu massa tempor lobortis.</Paragraph>
      <Paragraph>
        Vestibulum pretium arcu vel pellentesque sollicitudin.
      </Paragraph>
    </main>
  )
}

export default App