module.exports = require('../src/index.js')
.service('depC', [function () {}], require('./depA'));
