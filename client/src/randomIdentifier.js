const makeRandomIdentifier = () =>
  Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')

export default makeRandomIdentifier
