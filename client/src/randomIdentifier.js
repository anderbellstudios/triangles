const makeRandomIdentifier = (length = 16) =>
  Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')

export default makeRandomIdentifier
