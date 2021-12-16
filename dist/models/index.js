"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dbConfig = _interopRequireDefault(require("../config/db.config.js"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _logModel = _interopRequireDefault(require("./log.model.js"));

// import { Sequelize } from "sequelize/dist";
var sequelize = new _sequelize["default"](_dbConfig["default"].DB, _dbConfig["default"].USER, _dbConfig["default"].PASSWORD, {
  host: _dbConfig["default"].HOST,
  dialect: _dbConfig["default"].DIALECT,
  operatorAliases: false,
  pool: {
    max: _dbConfig["default"].pool.max,
    min: _dbConfig["default"].pool.min,
    acquire: _dbConfig["default"].pool.acquire,
    idle: _dbConfig["default"].pool.idle
  }
});
var _default = {
  Sequelize: _sequelize["default"],
  sequelize: sequelize,
  Log: (0, _logModel["default"])(sequelize, _sequelize["default"])
};
exports["default"] = _default;