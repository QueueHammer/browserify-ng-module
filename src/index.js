/*
#Browserify Angular Module Helper
Allows the creation of modules for Angular Modules. Creates modules that combine
name module binding and implimentation all in the same file! Will also bind
dependencies in order before loading binding the current module. Not that Angular
will really care because of lazy loading, but it's the right thing to do.
*/

//How the work gets done.
var _ = require('lodash');

//Object that we will export with select Angular bindings.
var namedActions = [
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

function namedActionBinding (action) {
  return function () {
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

        //For testing
        //console.log('spinning up module: ', name);
        ngModule[action](name, implimentation);
        return ngModule;
      });
    };
  };
}

var namelessActions = [
  'config',
  'run'
];

function namelessActionBinding (action) {
  return function () {
    //When each action is requested it will return an function to take the
    //name and it's implimentation.
    return function (implimentation) {
      //Anything else passed in will be assumed to be other modules that this
      //module will depend on. We want to save those for another closure.
      var deps = _.takeRight(arguments, arguments.length - 1);

      //Now create a function to take the module and bind our action, name,
      //and implimentation. Calling each of the deps before it does. The
      //result is a function that will only buind to the same module once.
      return _.memoize(function (ngModule) {
        _.each(deps, function (dep) {
          dep(ngModule);
        });
        
        //For testing
        //console.log('spinning up module: ', name);
        ngModule[action](implimentation);
        return ngModule;
      });
    };
  };
}

function actionBinder(keysForBidning, bindingFunction) {
  return function (bindingTarget) {
    return _.reduce(
      keysForBidning,
      function (target, key) {
        return Object.defineProperty(target, key, { get: bindingFunction(key) });
      },
      bindingTarget
    );
  };
}

module.exports = _.chain({})
.thru(actionBinder(namedActions, namedActionBinding))
.thru(actionBinder(namelessActions, namelessActionBinding))
.value();
