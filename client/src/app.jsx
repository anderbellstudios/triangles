import { useState } from 'preact/hooks'
import usePromiseResult from './usePromiseResult'
import useSocket from './useSocket'

const App = () => {
  const response = usePromiseResult(() =>
    fetch('/api/hello')
      .then(res => res.ok
        ? res.text()
        : new Promise((resolve, reject) => res.text().then(reject, reject))
      )
  )

  const [input, setInput] = useState('')

  const [connected, emit] = useSocket({
    query: {
      channel: 'general',
    },

    handlers: {
      'message': message => {
        setInput(message)
      },
    },
  })

  return (
    <main class="max-w-screen-md mx-auto p-8 rounded-lg shadow-lg bg-white">
      <h1 class="text-2xl font-bold mb-2">/api/hello</h1>
      <p class="text-gray-700 mb-4" aria-live="polite">
        {
          response
            .pending(() => 'Loading...')
            .resolved(message => message)
            .rejected(error => <span class="text-red-500">An error has occurred</span>)
            .value
        }
      </p>

      <h1 class="text-2xl font-bold mb-2">WebSocket</h1>
      <p class="text-gray-700 mb-4" aria-live="polite">
        {
          connected
            ? 'Connected'
            : 'Disconnected'
        }
      </p>

      <input
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white"
        placeholder="Type something here"
        value={input}
        onInput={e => {
          const { value } = e.target
          setInput(value)
          emit('message', value)
        }}
      />
    </main>
  )
}

export default App
