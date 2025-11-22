/**
 * Currency utilities for handling monetary amounts
 *
 * Best practice: Store amounts as integers in the smallest currency unit
 * (cents for USD/EUR, yen for JPY, etc.) to avoid floating-point precision errors.
 */

/**
 * Currency decimal places configuration
 * Defines how many decimal places each currency has
 */
const CURRENCY_DECIMALS = {
  USD: 2, // US Dollar - cents
  EUR: 2, // Euro - cents
  GBP: 2, // British Pound - pence
};

/**
 * Convert decimal amount to smallest currency unit (e.g., dollars to cents)
 *
 * @param {number} amount - The decimal amount (e.g., 40.55)
 * @param {string} currency - Currency code (e.g., 'USD')
 * @returns {number} Amount in smallest unit (e.g., 4055 cents)
 *
 * @example
 * toSmallestUnit(40.55, 'USD') // returns 4055
 * toSmallestUnit(40.5, 'USD')  // returns 4050
 * toSmallestUnit(100, 'JPY')   // returns 100
 * toSmallestUnit(40.555, 'KWD') // returns 40555
 */
function toSmallestUnit(amount, currency = 'USD') {
  const decimals = CURRENCY_DECIMALS[currency] || 2;
  return Math.round(amount * Math.pow(10, decimals));
}

/**
 * Convert smallest currency unit to decimal amount (e.g., cents to dollars)
 *
 * @param {number} amount - Amount in smallest unit (e.g., 4055 cents)
 * @param {string} currency - Currency code (e.g., 'USD')
 * @returns {number} Decimal amount (e.g., 40.55)
 *
 * @example
 * fromSmallestUnit(4055, 'USD') // returns 40.55
 * fromSmallestUnit(4050, 'USD') // returns 40.50
 * fromSmallestUnit(100, 'JPY')  // returns 100
 * fromSmallestUnit(40555, 'KWD') // returns 40.555
 */
function fromSmallestUnit(amount, currency = 'USD') {
  const decimals = CURRENCY_DECIMALS[currency] || 2;
  return amount / Math.pow(10, decimals);
}

module.exports = {
  toSmallestUnit,
  fromSmallestUnit,
};
