export interface WrappedFetchOptions extends RequestInit {
  timeout?: number;
  acceptResponse?: (response: Response) => boolean;
}

export const wrappedFetch = async (
  url: string,
  {
    timeout = 10000,
    acceptResponse = (response) => response.ok,
    ...options
  }: WrappedFetchOptions = {}
) => {
  const abortController = new AbortController()
  const timeoutID = setTimeout(() => abortController.abort(), timeout)

  const response = await fetch(url, {
    signal: abortController.signal,
    ...options,
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
