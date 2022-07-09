import { h } from 'preact'
import appState from './appState'
import { H1, H2, Paragraph, LeadParagraph } from './typography'
import GameArea from './GameArea'
import OnlineControls from './OnlineControls'
import AIControls from './AIControls'
import useViewport from './useViewport'

const App = () => {
  const { viewportWidth } = useViewport()
  const twoColumnLayout = viewportWidth >= 768

  return (
    <main class="mx-auto max-w-screen-lg">
      <H1>Triangles</H1>
      <LeadParagraph class="mb-8">
        3 players; 3 shapes; 3 in a line
      </LeadParagraph>

      <div class="align-center mb-8 flex flex-col justify-between gap-8 md:flex-row">
        <GameArea {...{ twoColumnLayout }} />

        <div class="flex flex-col gap-8">
          <OnlineControls />
          <AIControls />
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
