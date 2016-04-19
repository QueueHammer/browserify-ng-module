module.exports = require('../src/index.js')
.service('depB', [function () {}], require('./depA'));
