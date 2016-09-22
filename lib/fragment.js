'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RelativeFragment = exports.AbsoluteFragment = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var absolute = function absolute(ComposedComponent) {
  var AbsoluteFragment = function (_Component) {
    _inherits(AbsoluteFragment, _Component);

    function AbsoluteFragment() {
      _classCallCheck(this, AbsoluteFragment);

      return _possibleConstructorReturn(this, (AbsoluteFragment.__proto__ || Object.getPrototypeOf(AbsoluteFragment)).apply(this, arguments));
    }

    _createClass(AbsoluteFragment, [{
      key: 'render',
      value: function render() {
        var store = this.context.router.store;

        var location = store.getState().router;

        return _react2.default.createElement(ComposedComponent, _extends({
          location: location,
          matchRoute: store.matchRoute
        }, this.props));
      }
    }]);

    return AbsoluteFragment;
  }(_react.Component);

  AbsoluteFragment.contextTypes = {
    router: _react.PropTypes.object
  };

  return AbsoluteFragment;
};

var relative = function relative(ComposedComponent) {
  var RelativeFragment = function (_Component2) {
    _inherits(RelativeFragment, _Component2);

    function RelativeFragment() {
      _classCallCheck(this, RelativeFragment);

      return _possibleConstructorReturn(this, (RelativeFragment.__proto__ || Object.getPrototypeOf(RelativeFragment)).apply(this, arguments));
    }

    _createClass(RelativeFragment, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          // Append the parent route if this isn't the first
          // RelativeFragment in the hierarchy.
          parentRoute: this.context.parentRoute && this.context.parentRoute !== '/' && this.context.parentRoute !== this.props.forRoute ? '' + this.context.parentRoute + this.props.forRoute : this.props.forRoute
        };
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props;
        var children = _props.children;
        var forRoute = _props.forRoute;

        var rest = _objectWithoutProperties(_props, ['children', 'forRoute']);

        var _context = this.context;
        var router = _context.router;
        var parentRoute = _context.parentRoute;
        var store = router.store;


        var location = store.getState().router;

        var routePrefix = parentRoute && parentRoute !== '/' ? parentRoute : '';

        return _react2.default.createElement(ComposedComponent, _extends({
          location: location,
          matchRoute: store.matchWildcardRoute,
          forRoute: forRoute && '' + routePrefix + forRoute,
          children: children
        }, rest));
      }
    }]);

    return RelativeFragment;
  }(_react.Component);

  // Consumes this context...


  RelativeFragment.contextTypes = {
    router: _react.PropTypes.object,
    parentRoute: _react.PropTypes.string
  };

  // ...and provides this context.
  RelativeFragment.childContextTypes = {
    parentRoute: _react.PropTypes.string
  };

  return RelativeFragment;
};

var Fragment = function Fragment(props) {
  var location = props.location;
  var matchRoute = props.matchRoute;
  var forRoute = props.forRoute;
  var withConditions = props.withConditions;
  var children = props.children;


  var matchResult = matchRoute(location.pathname, forRoute);

  if (!matchResult) {
    return null;
  }

  if (forRoute && matchResult.route !== forRoute) {
    return null;
  }

  if (Array.isArray(props.forRoutes)) {
    var anyMatch = props.forRoutes.some(function (route) {
      return matchResult.route === route;
    });

    if (!anyMatch) {
      return null;
    }
  }

  if (withConditions && !withConditions(location)) {
    return null;
  }

  return _react2.default.createElement(
    'div',
    null,
    children
  );
};

var AbsoluteFragment = exports.AbsoluteFragment = absolute(Fragment);
var RelativeFragment = exports.RelativeFragment = relative(Fragment);