const Webpacker = require('@rails/webpacker')
const vueConfig = require('./rules/vue')

Webpacker.rules.map((rule, index) => {
  if(rule.type == 'asset/source' && rule.test[0] == '/\\.html$/') {
    Webpacker.rules[index].exclude[0] = /\.(js|mjs|jsx|ts|tsx|vue\.html)$/
  }
  if(rule.type == 'asset/resource') {
    Webpacker.rules[index].exclude[0] = /\.(js|svg|mjs|jsx|ts|tsx|vue\.html)$/
  }
})

let exportConfig = Webpacker.merge(Webpacker.webpackConfig, vueConfig)
delete exportConfig.optimization

module.exports = exportConfig
