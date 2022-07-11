import { useState, useEffect } from 'preact/hooks'

const commonState = {
  pending: false,
  rejected: false,
  resovled: false,
  value: null,
  error: null,
}

const usePromise = (initialPromise = null) => {
  const [promise, setPromise] = useState(initialPromise)

  const [state, setState] = useState(
    initialPromise === null
      ? { ...commonState }
      : { ...commonState, pending: true }
  )

  useEffect(() => {
    if (promise === null) {
      setState({ ...commonState })
      return
    }

    setState({ ...commonState, pending: true })

    promise
      .then(value => setState({ ...commonState, resovled: true, value }))
      .catch(error => setState({ ...commonState, rejected: true, error }))
  }, [promise])

  return [state, setPromise]
}

export default usePromise
