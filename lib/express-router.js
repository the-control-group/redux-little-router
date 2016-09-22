'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createMemoryHistory = require('history/lib/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _useBasename = require('history/lib/useBasename');

var _useBasename2 = _interopRequireDefault(_useBasename);

var _useQueries = require('history/lib/useQueries');

var _useQueries2 = _interopRequireDefault(_useQueries);

var _storeEnhancer = require('./store-enhancer');

var _storeEnhancer2 = _interopRequireDefault(_storeEnhancer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var routes = _ref.routes;
  var request = _ref.request;

  var history = (0, _useBasename2.default)((0, _useQueries2.default)(_createMemoryHistory2.default))({
    basename: request.baseUrl
  });

  var location = history.createLocation({
    pathname: request.path,
    query: request.query
  });

  return (0, _storeEnhancer2.default)({ routes: routes, history: history, location: location });
};