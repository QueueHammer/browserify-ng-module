module.exports = require('../src/index.js')
.service('depE', [function () {}], require('./depB'), require('./depC'));
