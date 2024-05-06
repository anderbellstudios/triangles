import { useState, useEffect } from 'preact/hooks'

interface UsePromiseState<T> {
  pending: boolean;
  rejected: boolean;
  resolved: boolean;
  value: T | null;
  error: Error | null;
}

const commonState: UsePromiseState<never> = {
  pending: false,
  rejected: false,
  resolved: false,
  value: null,
  error: null,
}

export const usePromise = <T>(initialPromise: Promise<T> | null = null) => {
  const [promise, setPromise] = useState(initialPromise)

  const [state, setState] = useState<UsePromiseState<T>>(
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
      .then(value => setState({ ...commonState, resolved: true, value }))
      .catch(error => setState({ ...commonState, rejected: true, error }))
  }, [promise])

  return [state, setPromise] as const
}
