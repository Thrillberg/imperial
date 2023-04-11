process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfig = require('./base');

webpackConfig.plugins.push(
  new HtmlWebpackPlugin({
    alwaysWriteToDisk: true,
    appMountId: 'app',
    favicon: 'favicon.ico',
    inject: 'body',
    lang: 'en-US',
    meta: {
      charset: 'UTF-8',
      description: 'Play Imperial online',
      keywords: 'imperial, board game, game, online, play',
      viewport: 'width=device-width, initial-scale=1',
    },
    title: 'Imperial',
  }),
);
module.exports = webpackConfig;
