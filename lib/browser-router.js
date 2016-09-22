'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createBrowserHistory = require('history/lib/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _useBasename = require('history/lib/useBasename');

var _useBasename2 = _interopRequireDefault(_useBasename);

var _useQueries = require('history/lib/useQueries');

var _useQueries2 = _interopRequireDefault(_useQueries);

var _storeEnhancer = require('./store-enhancer');

var _storeEnhancer2 = _interopRequireDefault(_storeEnhancer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next: unstubbable! */
var realLocation = function realLocation() {
  return window.location;
};

exports.default = function (_ref) {
  var routes = _ref.routes;
  var basename = _ref.basename;
  var _ref$getLocation = _ref.getLocation;
  var getLocation = _ref$getLocation === undefined ? realLocation : _ref$getLocation;

  var history = (0, _useBasename2.default)((0, _useQueries2.default)(_createBrowserHistory2.default))({
    basename: basename
  });

  var _getLocation = getLocation();

  var pathname = _getLocation.pathname;
  var search = _getLocation.search;

  var location = history.createLocation({ pathname: pathname, search: search });

  return (0, _storeEnhancer2.default)({ routes: routes, history: history, location: location });
};