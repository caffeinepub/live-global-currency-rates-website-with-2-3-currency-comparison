import { useQuery } from '@tanstack/react-query';
import { fetchHistoricalRates } from '../api/historicalRates';
import { computeDateRange, type DateRangePreset } from '../lib/dateRanges';

/**
 * React Query hook for fetching historical exchange rates
 * @param baseCurrency - The base currency code
 * @param targetCurrency - The target currency code
 * @param dateRangePreset - The date range preset (7D, 1M, 3M, 1Y)
 * @returns Query result with historical rate points, loading state, error state, and refetch function
 */
export function useHistoricalRates(
  baseCurrency: string,
  targetCurrency: string,
  dateRangePreset: DateRangePreset
) {
  const { startDate, endDate } = computeDateRange(dateRangePreset);

  return useQuery({
    queryKey: ['historical-rates', baseCurrency, targetCurrency, dateRangePreset],
    queryFn: () => fetchHistoricalRates(baseCurrency, targetCurrency, startDate, endDate),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    enabled: !!baseCurrency && !!targetCurrency,
  });
}
