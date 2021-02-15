module.exports = {
  purge: [
    "./app/javascript/src/**/*.vue",
    "./app/javascript/src/**/*.js",
    "./app/javascript/src/**/*.svg"
  ],
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'AH': '#ebe084',
      'IT': '#6E8D4E',
      'FR': '#54bff9',
      'GB': '#EF7F72',
      'GE': 'silver',
      'RU': '#9c6bae',
    })
  }
}
