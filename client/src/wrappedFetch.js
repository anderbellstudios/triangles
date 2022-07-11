const wrappedFetch = async (url, options = {}) => {
  const {
    timeout = 10000,
    acceptResponse = response => response.ok,
    ...otherOptions
  } = options

  const abortController = new AbortController()
  const timeoutID = setTimeout(() => abortController.abort(), timeout)

  const response = await fetch(url, {
    signal: abortController.signal,
    ...otherOptions,
  }).catch(error => {
    console.error(error)

    if (error.name === 'AbortError') {
      return Promise.reject(new Error("The server isn't responding"))
    } else {
      return Promise.reject(new Error('Could not connect to the server'))
    }
  })

  clearTimeout(timeoutID)

  if (acceptResponse(response)) {
    return response
  } else {
    return Promise.reject(new Error('An unknown error occurred'))
  }
}

export default wrappedFetch
