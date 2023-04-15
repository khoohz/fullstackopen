//printing normal log messages
const info = (...params) => {
  console.log(...params)
}

//printing error messages
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}