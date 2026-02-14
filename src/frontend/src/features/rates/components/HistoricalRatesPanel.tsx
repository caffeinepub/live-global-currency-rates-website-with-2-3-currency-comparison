import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { useHistoricalRates } from '../hooks/useHistoricalRates';
import { HistoricalRatesChart } from './HistoricalRatesChart';
import { DateRangePresets } from './DateRangePresets';
import { getCurrencyName } from '../currencyMeta';
import type { DateRangePreset } from '../lib/dateRanges';

interface HistoricalRatesPanelProps {
  baseCurrency: string;
  targetCurrency: string;
  onClose: () => void;
}

export function HistoricalRatesPanel({
  baseCurrency,
  targetCurrency,
  onClose,
}: HistoricalRatesPanelProps) {
  const [selectedRange, setSelectedRange] = useState<DateRangePreset>('1M');
  const { data, isLoading, isError, refetch } = useHistoricalRates(
    baseCurrency,
    targetCurrency,
    selectedRange
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 mt-1">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Historical Exchange Rate</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getCurrencyName(targetCurrency)} ({targetCurrency}) per 1{' '}
                {getCurrencyName(baseCurrency)} ({baseCurrency})
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <DateRangePresets
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Chart Area */}
        {isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading historical data</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                We couldn't fetch the historical rates. Please check your connection and
                try again.
              </span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="border rounded-lg p-4 bg-card">
            <HistoricalRatesChart
              data={data}
              baseCurrency={baseCurrency}
              targetCurrency={targetCurrency}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No historical data available</p>
          </div>
        )}

        {/* Data Summary */}
        {data && data.length > 0 && !isLoading && (
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
            <span>
              {data.length} data points from {data[0].date} to{' '}
              {data[data.length - 1].date}
            </span>
            <span>
              Current: {data[data.length - 1].rate.toFixed(4)} {targetCurrency}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
