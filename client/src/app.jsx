import usePromiseResult from './usePromiseResult'

const App = () => {
  const response = usePromiseResult(() =>
    fetch('/api/hello')
      .then(res => res.ok
        ? res.text()
        : new Promise((resolve, reject) => res.text().then(reject, reject))
      )
  )

  return (
    <main class="max-w-screen-md mx-auto mt-16 p-8 rounded-lg shadow-lg bg-white">
      <h1 class="text-2xl font-bold mb-4">/api/hello</h1>
      <p class="text-gray-700" aria-live="polite">
        {
          response
            .pending(() => 'Loading...')
            .resolved(message => message)
            .rejected(error => <span class="text-red-500">{error}</span>)
            .value
        }
      </p>
    </main>
  )
}

export default App
