// Centralized exchange rate API configuration and fetching

// Single configurable data source - can be easily swapped
export const EXCHANGE_RATE_API_BASE = 'https://api.frankfurter.app';

export interface ExchangeRateResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

/**
 * Fetches the latest exchange rates for a given base currency
 * @param baseCurrency - The base currency code (e.g., 'USD', 'EUR')
 * @returns Promise with exchange rate data
 */
export async function fetchExchangeRates(
  baseCurrency: string
): Promise<ExchangeRateResponse> {
  const url = `${EXCHANGE_RATE_API_BASE}/latest?from=${baseCurrency}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Fetches available currencies from the API
 * @returns Promise with currency codes and names
 */
export async function fetchAvailableCurrencies(): Promise<Record<string, string>> {
  const url = `${EXCHANGE_RATE_API_BASE}/currencies`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch currencies: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
