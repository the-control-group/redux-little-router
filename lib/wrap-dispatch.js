'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actionTypes = require('./action-types');

exports.default = function (store, history) {
  return function (action) {
    switch (action.type) {
      case _actionTypes.PUSH:
        history.push(action.payload);
        return null;
      case _actionTypes.REPLACE:
        history.replace(action.payload);
        return null;
      case _actionTypes.GO:
        history.go(action.payload);
        return null;
      case _actionTypes.GO_BACK:
        history.goBack();
        return null;
      case _actionTypes.GO_FORWARD:
        history.goForward();
        return null;
      default:
        // We return the result of dispatch here
        // to retain compatibility with enhancers
        // that return a promise from dispatch.
        return store.dispatch(action);
    }
  };
};