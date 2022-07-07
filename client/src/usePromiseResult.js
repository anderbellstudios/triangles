import { useState, useEffect } from 'preact/hooks'

class PromiseResult {
  value = undefined

  constructor(promiseState, promiseValue) {
    this.promiseState = promiseState
    this.promiseValue = promiseValue
  }

  pending(handler) {
    if (this.promiseState === 'pending') {
      this.value = handler(this.promiseValue)
    }

    return this
  }

  resolved(handler) {
    if (this.promiseState === 'resolved') {
      this.value = handler(this.promiseValue)
    }

    return this
  }

  rejected(handler) {
    if (this.promiseState === 'rejected') {
      this.value = handler(this.promiseValue)
    }

    return this
  }
}

const usePromiseResult = (promiseProducer, dependencies = []) => {
  const [state, setState] = useState('pending')
  const [value, setValue] = useState(null)

  useEffect(() => {
    setState('pending')
    setValue(null)

    promiseProducer()
      .then(value => {
        setState('resolved')
        setValue(value)
      })
      .catch(error => {
        setState('rejected')
        setValue(error)
      })
  }, dependencies)

  return new PromiseResult(state, value)
}

export default usePromiseResult
