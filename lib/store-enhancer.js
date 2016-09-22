'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createMatcher = require('./create-matcher');

var _createMatcher2 = _interopRequireDefault(_createMatcher);

var _reducerEnhancer = require('./reducer-enhancer');

var _reducerEnhancer2 = _interopRequireDefault(_reducerEnhancer);

var _actionCreators = require('./action-creators');

var _wrapDispatch = require('./wrap-dispatch');

var _wrapDispatch2 = _interopRequireDefault(_wrapDispatch);

var _validateRoutes = require('./util/validate-routes');

var _validateRoutes2 = _interopRequireDefault(_validateRoutes);

var _flattenRoutes = require('./util/flatten-routes');

var _flattenRoutes2 = _interopRequireDefault(_flattenRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var nestedRoutes = _ref.routes;
  var history = _ref.history;
  var location = _ref.location;
  var _ref$createMatcher = _ref.createMatcher;
  var createMatcher = _ref$createMatcher === undefined ? _createMatcher2.default : _ref$createMatcher;

  (0, _validateRoutes2.default)(nestedRoutes);
  var routes = (0, _flattenRoutes2.default)(nestedRoutes);

  return function (createStore) {
    return function (reducer, initialState, enhancer) {
      var enhancedReducer = (0, _reducerEnhancer2.default)(reducer);

      var matchRoute = createMatcher(routes);
      var matchWildcardRoute = createMatcher(routes, true);

      var initialStateWithRouter = _extends({}, initialState, {
        router: _extends({}, location, matchRoute(location.pathname))
      });

      var store = createStore(enhancedReducer, initialStateWithRouter, enhancer);

      history.listen(function (newLocation) {
        /* istanbul ignore else */
        if (newLocation) {
          store.dispatch((0, _actionCreators.locationDidChange)({
            location: newLocation, matchRoute: matchRoute
          }));
        }
      });

      var dispatch = (0, _wrapDispatch2.default)(store, history);

      return _extends({}, store, {
        dispatch: dispatch,

        // We attach routes here to allow <RouterProvider>
        // to access unserializable properties of route results.
        routes: routes,

        history: history,
        matchRoute: matchRoute,
        matchWildcardRoute: matchWildcardRoute
      });
    };
  };
};