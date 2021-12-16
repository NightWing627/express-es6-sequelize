"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _loginCookie = _interopRequireDefault(require("../loginCookie.js"));

var _constants = require("../constants.js");

var _helpers = require("../helpers.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var BBChecking = /*#__PURE__*/function () {
  function BBChecking() {
    (0, _classCallCheck2["default"])(this, BBChecking);
  }

  (0, _createClass2["default"])(BBChecking, [{
    key: "getBalance",
    value: function () {
      var _getBalance = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var balanceUrl, response, text, _JSON$parse, servicoSaldo, saldo;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                balanceUrl = 'servico/ServicoSaldo/saldo';
                _context.next = 3;
                return (0, _nodeFetch["default"])("".concat(_constants.BASE_ENDPOINT).concat(balanceUrl), {
                  headers: _objectSpread(_objectSpread({}, _constants.DEFAULT_HEADERS), {}, {
                    cookie: _loginCookie["default"].getGlobal()
                  }),
                  method: 'POST'
                });

              case 3:
                response = _context.sent;
                _context.next = 6;
                return response.text();

              case 6:
                text = _context.sent;
                _JSON$parse = JSON.parse(text), servicoSaldo = _JSON$parse.servicoSaldo;
                saldo = servicoSaldo.saldo;
                return _context.abrupt("return", (0, _helpers.parseAmountString)(saldo));

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getBalance() {
        return _getBalance.apply(this, arguments);
      }

      return getBalance;
    }()
  }]);
  return BBChecking;
}();

exports["default"] = BBChecking;