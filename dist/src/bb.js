"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _querystring = _interopRequireDefault(require("querystring"));

var _loginCookie = _interopRequireDefault(require("./loginCookie.js"));

var _constants = require("./constants.js");

var _index = _interopRequireDefault(require("./checking/index.js"));

var refreshHash = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var hashUrl, params, response, hash;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hashUrl = 'hash';
            params = {
              id: '00000000000000000000000000000000'
            };
            _context.next = 4;
            return (0, _nodeFetch["default"])("".concat(_constants.BASE_ENDPOINT).concat(hashUrl), {
              headers: _constants.DEFAULT_HEADERS,
              method: 'POST',
              body: _querystring["default"].stringify(params)
            });

          case 4:
            response = _context.sent;
            _context.next = 7;
            return response.text();

          case 7:
            hash = _context.sent;
            return _context.abrupt("return", hash);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function refreshHash() {
    return _ref.apply(this, arguments);
  };
}();

var BB = /*#__PURE__*/function () {
  function BB() {
    (0, _classCallCheck2["default"])(this, BB);
    (0, _defineProperty2["default"])(this, "checking", null);
    (0, _defineProperty2["default"])(this, "savings", null);
    (0, _defineProperty2["default"])(this, "creditCard", null);

    _loginCookie["default"].setGlobal();
  }

  (0, _createClass2["default"])(BB, [{
    key: "isLoggedIn",
    value: function isLoggedIn() {
      return !!_loginCookie["default"].getGlobal();
    }
  }, {
    key: "login",
    value: function () {
      var _login = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
        var branch, account, password, loginUrl, hash, params, response, text, _JSON$parse, login;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                branch = _ref2.branch, account = _ref2.account, password = _ref2.password;
                loginUrl = 'servico/ServicoLogin/login';
                _context2.next = 4;
                return refreshHash();

              case 4:
                hash = _context2.sent;
                params = {
                  idh: hash,
                  dependenciaOrigem: branch,
                  numeroContratoOrigem: account,
                  senhaConta: password,
                  titularidade: '1',
                  apelido: 'NickRandom.123456',
                  idDispositivo: '2131296671'
                };
                _context2.next = 8;
                return (0, _nodeFetch["default"])("".concat(_constants.BASE_ENDPOINT).concat(loginUrl), {
                  headers: _constants.DEFAULT_HEADERS,
                  method: 'POST',
                  body: _querystring["default"].stringify(params)
                });

              case 8:
                response = _context2.sent;

                _loginCookie["default"].setGlobal(response.headers.get('set-cookie'));

                _context2.next = 12;
                return response.text();

              case 12:
                text = _context2.sent;
                _JSON$parse = JSON.parse(text), login = _JSON$parse.login;
                this.checking = new _index["default"]();
                return _context2.abrupt("return", login);

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function login(_x) {
        return _login.apply(this, arguments);
      }

      return login;
    }()
  }]);
  return BB;
}();

exports["default"] = BB;