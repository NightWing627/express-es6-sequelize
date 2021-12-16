export function parseAmountString(amountString) {
  const parsedAmount = amountString.replace(' ', '');
  const isPositive = parsedAmount.substr(-1) === 'C';

  const amount = parseFloat(
    parsedAmount
      .slice(0, -1)
      .replace('.', '')
      .replace(',', '.'),
  );

  return isPositive ? amount : -amount;
}
