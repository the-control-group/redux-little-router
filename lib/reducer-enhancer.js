'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (vanillaReducer) {
  return function (state, action) {
    var vanillaState = _extends({}, state);
    delete vanillaState.router;

    var newState = vanillaReducer(vanillaState, action);

    // Support redux-loop
    if (Array.isArray(newState)) {
      var nextState = newState[0]; // eslint-disable-line no-magic-numbers
      var nextEffects = newState[1]; // eslint-disable-line no-magic-numbers
      return [_extends({}, nextState, {
        router: (0, _reducer2.default)(state && state.router, action)
      }), nextEffects];
    }

    return _extends({}, newState, {
      router: (0, _reducer2.default)(state && state.router, action)
    });
  };
};