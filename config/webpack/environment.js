const { environment } = require('@rails/webpacker');

environment.config.merge({
  performance: {
    maxAssetSize: 500000,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});

module.exports = environment;
