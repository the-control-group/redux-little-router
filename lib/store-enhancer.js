'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeCurrentLocation = exports.locationDidChange = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createBrowserHistory = require('history/lib/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createMemoryHistory = require('history/lib/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _useBasename = require('history/lib/useBasename');

var _useBasename2 = _interopRequireDefault(_useBasename);

var _useQueries = require('history/lib/useQueries');

var _useQueries2 = _interopRequireDefault(_useQueries);

var _actionTypes = require('./action-types');

var _createMatcher = require('./create-matcher');

var _createMatcher2 = _interopRequireDefault(_createMatcher);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _flattenRoutes = require('./util/flatten-routes');

var _flattenRoutes2 = _interopRequireDefault(_flattenRoutes);

var _initialRouterState = require('./util/initial-router-state');

var _initialRouterState2 = _interopRequireDefault(_initialRouterState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var README_MESSAGE = '\n  See the README for more information:\n  https://github.com/FormidableLabs/redux-little-router#wiring-up-the-boilerplate\n';

var locationDidChange = exports.locationDidChange = function locationDidChange(_ref) {
  var location = _ref.location;
  var matchRoute = _ref.matchRoute;

  // Extract the pathname so that we don't match against the basename.
  // This avoids requiring basename-hardcoded routes.
  var pathname = location.pathname;


  return {
    type: _actionTypes.LOCATION_CHANGED,
    payload: _extends({}, location, matchRoute(pathname))
  };
};

var initializeCurrentLocation = exports.initializeCurrentLocation = function initializeCurrentLocation(location) {
  return {
    type: _actionTypes.LOCATION_CHANGED,
    payload: location
  };
};

var resolveHistory = function resolveHistory(_ref2) {
  var basename = _ref2.basename;
  var forServerRender = _ref2.forServerRender;

  var historyFactory = forServerRender ? _createMemoryHistory2.default : _createBrowserHistory2.default;

  return (0, _useBasename2.default)((0, _useQueries2.default)(historyFactory))({
    basename: basename
  });
};

exports.default = function (_ref3) {
  var nestedRoutes = _ref3.routes;
  var pathname = _ref3.pathname;
  var query = _ref3.query;
  var _ref3$basename = _ref3.basename;
  var basename = _ref3$basename === undefined ? '' : _ref3$basename;
  var _ref3$forServerRender = _ref3.forServerRender;
  var forServerRender = _ref3$forServerRender === undefined ? false : _ref3$forServerRender;
  var _ref3$createMatcher = _ref3.createMatcher;
  var createMatcher = _ref3$createMatcher === undefined ? _createMatcher2.default : _ref3$createMatcher;
  var userHistory = _ref3.history;

  if (!nestedRoutes) {
    throw Error('\n      Missing route configuration. You must define your routes as\n      an object where the keys are routes and the values are any\n      route-specific data.\n\n      ' + README_MESSAGE + '\n    ');
  }

  // eslint-disable-next-line no-magic-numbers
  if (!Object.keys(nestedRoutes).every(function (route) {
    return route.indexOf('/') === 0;
  })) {
    throw Error('\n      The route configuration you provided is malformed. Make sure\n      that all of your routes start with a slash.\n\n      ' + README_MESSAGE + '\n    ');
  }

  var routes = (0, _flattenRoutes2.default)(nestedRoutes);

  var history = userHistory || resolveHistory({
    basename: basename, forServerRender: forServerRender
  });

  return function (createStore) {
    return function (reducer, initialState, enhancer) {
      var enhancedReducer = function enhancedReducer(state, action) {
        var vanillaState = _extends({}, state);
        delete vanillaState.router;

        var newState = reducer(vanillaState, action);

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

      var store = createStore(enhancedReducer, pathname || query ? _extends({}, initialState, {
        router: (0, _initialRouterState2.default)({
          pathname: pathname, query: query || {}, routes: routes, history: history
        })
      }) : initialState, enhancer);

      var matchRoute = createMatcher(routes);
      var matchWildcardRoute = createMatcher(routes, true);

      history.listen(function (location) {
        if (location) {
          store.dispatch(locationDidChange({
            location: location, matchRoute: matchRoute
          }));
        }
      });

      var dispatch = function dispatch(action) {
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