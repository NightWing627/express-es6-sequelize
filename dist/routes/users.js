"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var router = _express["default"].Router();
/* GET users listing. */


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
var _default = router;
exports["default"] = _default;