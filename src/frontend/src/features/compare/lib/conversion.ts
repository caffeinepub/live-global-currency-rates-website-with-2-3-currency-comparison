/**
 * Converts an amount from one currency to another using rates relative to a base currency
 * @param amount - The amount to convert
 * @param fromCurrency - The source currency code
 * @param toCurrency - The target currency code
 * @param baseCurrency - The base currency that rates are relative to
 * @param rates - Object mapping currency codes to their rates relative to base
 * @returns The converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  baseCurrency: string,
  rates: Record<string, number>
): number {
  // If converting to/from the same currency, return the amount
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Get the rate for the source currency (1 if it's the base)
  const fromRate = fromCurrency === baseCurrency ? 1 : rates[fromCurrency];

  // Get the rate for the target currency (1 if it's the base)
  const toRate = toCurrency === baseCurrency ? 1 : rates[toCurrency];

  // Guard against missing rates
  if (!fromRate || !toRate) {
    return 0;
  }

  // Convert: amount in fromCurrency -> base currency -> toCurrency
  // First convert to base: amount / fromRate
  // Then convert to target: (amount / fromRate) * toRate
  return (amount / fromRate) * toRate;
}
