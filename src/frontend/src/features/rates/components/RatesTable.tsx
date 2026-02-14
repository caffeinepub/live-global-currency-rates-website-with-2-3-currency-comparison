import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrencyName } from '../currencyMeta';
import { Search, ArrowUpDown, AlertCircle, LineChart } from 'lucide-react';

interface RatesTableProps {
  baseCurrency: string;
  rates: Record<string, number>;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onOpenHistorical?: (targetCurrency: string) => void;
}

type SortField = 'code' | 'name' | 'rate';
type SortDirection = 'asc' | 'desc';

export function RatesTable({
  baseCurrency,
  rates,
  isLoading,
  isError,
  onRetry,
  onOpenHistorical,
}: RatesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedRates = useMemo(() => {
    const entries = Object.entries(rates);

    // Filter by search query
    const filtered = entries.filter(([code]) =>
      code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCurrencyName(code).toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    const sorted = filtered.sort(([codeA, rateA], [codeB, rateB]) => {
      let comparison = 0;

      switch (sortField) {
        case 'code':
          comparison = codeA.localeCompare(codeB);
          break;
        case 'name':
          comparison = getCurrencyName(codeA).localeCompare(getCurrencyName(codeB));
          break;
        case 'rate':
          comparison = rateA - rateB;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [rates, searchQuery, sortField, sortDirection]);

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading exchange rates</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            We couldn't fetch the latest rates. Please check your connection and try
            again.
          </span>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="border rounded-lg">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full mb-2" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search currencies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('code')}
                  className="gap-1 font-semibold"
                >
                  Code
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="gap-1 font-semibold"
                >
                  Currency
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('rate')}
                  className="gap-1 font-semibold ml-auto"
                >
                  Rate (per 1 {baseCurrency})
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              {onOpenHistorical && (
                <TableHead className="w-[100px]">
                  <span className="font-semibold">Chart</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedRates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={onOpenHistorical ? 4 : 3} className="text-center py-8 text-muted-foreground">
                  No currencies found matching "{searchQuery}"
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedRates.map(([code, rate]) => (
                <TableRow key={code} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono font-semibold">{code}</TableCell>
                  <TableCell>{getCurrencyName(code)}</TableCell>
                  <TableCell className="text-right font-mono">
                    {rate.toFixed(4)}
                  </TableCell>
                  {onOpenHistorical && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenHistorical(code)}
                        className="gap-1"
                      >
                        <LineChart className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedRates.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredAndSortedRates.length} of {Object.keys(rates).length}{' '}
          currencies
        </p>
      )}
    </div>
  );
}
