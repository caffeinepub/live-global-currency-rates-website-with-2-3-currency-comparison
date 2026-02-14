import { useQuery } from '@tanstack/react-query';
import { fetchExchangeRates } from '../api/exchangeRates';

const REFETCH_INTERVAL = 60000; // 60 seconds

/**
 * React Query hook for fetching live exchange rates with auto-refresh
 * @param baseCurrency - The base currency code
 * @returns Query result with rates data, loading state, error state, and refetch function
 */
export function useLiveRates(baseCurrency: string) {
  return useQuery({
    queryKey: ['exchange-rates', baseCurrency],
    queryFn: () => fetchExchangeRates(baseCurrency),
    refetchInterval: REFETCH_INTERVAL,
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
