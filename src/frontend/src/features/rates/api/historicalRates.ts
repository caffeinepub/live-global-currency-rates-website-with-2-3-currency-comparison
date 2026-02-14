// Historical exchange rate fetching using Frankfurter API

import { EXCHANGE_RATE_API_BASE } from './exchangeRates';

export interface HistoricalRatePoint {
  date: string;
  rate: number;
}

export interface HistoricalRatesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

/**
 * Fetches historical exchange rates for a currency pair over a date range
 * @param baseCurrency - The base currency code
 * @param targetCurrency - The target currency code
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Array of historical rate points
 */
export async function fetchHistoricalRates(
  baseCurrency: string,
  targetCurrency: string,
  startDate: string,
  endDate: string
): Promise<HistoricalRatePoint[]> {
  const url = `${EXCHANGE_RATE_API_BASE}/${startDate}..${endDate}?from=${baseCurrency}&to=${targetCurrency}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch historical rates: ${response.statusText}`);
  }

  const data: HistoricalRatesResponse = await response.json();

  // Transform the nested rates object into a flat array of points
  const points: HistoricalRatePoint[] = Object.entries(data.rates).map(
    ([date, ratesForDate]) => ({
      date,
      rate: ratesForDate[targetCurrency] || 0,
    })
  );

  // Sort by date ascending
  points.sort((a, b) => a.date.localeCompare(b.date));

  return points;
}
