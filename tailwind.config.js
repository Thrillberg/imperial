module.exports = {
  purge: {
    content: [
      "./app/javascript/src/**/*.vue",
      "./app/javascript/src/**/*.js",
      "./app/javascript/src/**/*.svg"
    ],
    options: {
      safelist: ['bg-AH', 'bg-IT', 'bg-FR', 'bg-GB', 'bg-GE', 'bg-RU', 'bg-CN', 'bg-IN', 'bg-BR', 'bg-US', 'bg-EU']
    }
  },
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'AH': '#ebe084',
      'IT': '#6E8D4E',
      'FR': '#54bff9',
      'GB': '#EF7F72',
      'GE': 'silver',
      'RU': '#9c6bae',
      'CN': '#ebe084',
      'IN': 'silver',
      'BR': '#6E8D4E',
      'US': '#EF7F72',
      'EU': '#54bff9'
    })
  }
}
