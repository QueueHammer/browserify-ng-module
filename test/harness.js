//Requires
var ng = require('angular');

function makeRandomId() {
  return Math.random().toString().split('.')[1];
}

//To run add `console.log(name, action);` to line 42 of index.js
//This will spy on the init of the memoniz functions

//Create the angular app.
var randomId = makeRandomId() + makeRandomId();
var app = ng.module(randomId, []);

//Load the modules you need
//...
require('./depA')(app);
require('./depE')(app);
require('./depD')(app);
require('./depF')(app);
