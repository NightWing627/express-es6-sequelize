"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bb = _interopRequireDefault(require("../bb"));

var bb = new _bb["default"]();
describe('Checking', function () {
  it('returns checking balance', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var credentials, balance;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            credentials = {
              branch: '12340',
              account: '123456',
              password: '12345678'
            };
            _context.next = 3;
            return bb.login(credentials);

          case 3:
            _context.next = 5;
            return bb.checking.getBalance();

          case 5:
            balance = _context.sent;
            expect(balance).toEqual(20345.78);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('returns checking transactions', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var credentials, transactions;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            credentials = {
              branch: '12340',
              account: '123456',
              password: '12345678'
            };
            _context2.next = 3;
            return bb.login(credentials);

          case 3:
            _context2.next = 5;
            return bb.checking.getTransactions({
              year: 2018,
              month: 4
            });

          case 5:
            transactions = _context2.sent;
            expect(transactions).toHaveLength(5);
            expect(transactions).toMatchObject([{
              date: new Date(2018, 3, 16),
              amount: -82.5,
              description: 'Transferência enviada 15/04 1100 110540-1 JOAO DE ALMEIDA'
            }, {
              date: new Date(2018, 3, 17),
              amount: -10,
              description: 'Transferência enviada 17/04 8125 950100-9 MARA GARGIA AL'
            }, {
              date: new Date(2018, 3, 23),
              amount: -374.56,
              description: 'Compra com Cartão 21/04 20:00 SUPERMERCADO 061 AS'
            }, {
              date: new Date(2018, 3, 27),
              amount: -50,
              description: 'Transferência enviada 27/04 1234 123454-0 JOAO DE ALMEIDA'
            }, {
              date: new Date(2018, 3, 28),
              amount: 1107.42,
              description: 'Transferência recebida 28/04 3455 456123-1 IBM'
            }]);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});