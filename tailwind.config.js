const nationColors = require("./nationColors.js");

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
      ...nationColors
    })
  }
}
