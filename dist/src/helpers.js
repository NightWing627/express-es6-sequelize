"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAmountString = parseAmountString;

function parseAmountString(amountString) {
  var parsedAmount = amountString.replace(' ', '');
  var isPositive = parsedAmount.substr(-1) === 'C';
  var amount = parseFloat(parsedAmount.slice(0, -1).replace('.', '').replace(',', '.'));
  return isPositive ? amount : -amount;
}