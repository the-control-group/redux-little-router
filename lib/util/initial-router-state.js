'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createMatcher = require('../create-matcher');

var _createMatcher2 = _interopRequireDefault(_createMatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var _ref$pathname = _ref.pathname;
  var pathname = _ref$pathname === undefined ? '/' : _ref$pathname;
  var _ref$query = _ref.query;
  var query = _ref$query === undefined ? {} : _ref$query;
  var routes = _ref.routes;
  var history = _ref.history;
  return _extends({}, history.createLocation({
    pathname: pathname,
    query: query
  }), (0, _createMatcher2.default)(routes)(pathname));
};