"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  HOST: 'localhost',
  USER: 'root',
  PASSWORD: '',
  DB: 'u426170630_db_netflix',
  DIALECT: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
exports["default"] = _default;