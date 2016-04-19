/*
#Browserify Angular Module Helper
Allows the creation of modules for Angular Modules. Creates modules that combine
name module binding and implimentation all in the same file! Will also bind
dependencies in order before loading binding the current module. Not tht Angular
will really care, but it's the right thing to do.
*/

//How the work gets done.
var _ = require('lodash');

//Object that we will export with select Angular bindings.
var wrapper = {};
var actions = [
  'provider',
  'factory',
  'service',
  'value',
  'constant',
  'decorator',
  'animation',
  'filter',
  'controller',
  'directive',
  'component'
];

//Go over all the bindings and apply them to our wrapper.
_.each(actions, function (action) {
  Object.defineProperty(wrapper, action, {
    get: function () {
      //When each action is requested it will return an function to take the
      //name and it's implimentation.
      return function (name, implimentation) {
        //Anything else passed in will be assumed to be other modules that this
        //module will depend on. We want to save those for another closure.
        var deps = _.takeRight(arguments, arguments.length - 2);

        //Now create a function to take the module and bind our action, name,
        //and implimentation. Calling each of the deps before it does. The
        //result is a function that will only buind to the same module once.
        return _.memoize(function (ngModule) {
          _.each(deps, function (dep) {
            dep(ngModule);
          });

          ngModule[action](name, implimentation);
          return ngModule;
        });
      };
    }
  });
});

//Finally export the wrapper.
module.exports = wrapper;
