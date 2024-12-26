process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.NODE_OPTIONS = '--max-old-space-size=460';

const webpackConfig = require('./base');

module.exports = webpackConfig;
