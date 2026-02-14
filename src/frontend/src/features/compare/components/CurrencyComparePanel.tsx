import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ConversionWidget } from './ConversionWidget';
import { getCurrencyName } from '@/features/rates/currencyMeta';
import { AlertCircle, TrendingUp } from 'lucide-react';

interface CurrencyComparePanelProps {
  baseCurrency: string;
  rates: Record<string, number>;
  isLoading: boolean;
}

export function CurrencyComparePanel({
  baseCurrency,
  rates,
  isLoading,
}: CurrencyComparePanelProps) {
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);

  const availableCurrencies = [baseCurrency, ...Object.keys(rates)].sort();

  const handleCurrencySelect = (index: number, currency: string) => {
    const newSelected = [...selectedCurrencies];
    newSelected[index] = currency;
    setSelectedCurrencies(newSelected);
  };

  const handleRemoveCurrency = (index: number) => {
    const newSelected = selectedCurrencies.filter((_, i) => i !== index);
    setSelectedCurrencies(newSelected);
  };

  const canAddMore = selectedCurrencies.length < 3;
  const hasValidSelection = selectedCurrencies.length >= 2;

  // Check for duplicates
  const hasDuplicates =
    selectedCurrencies.length !== new Set(selectedCurrencies).size;

  // Get rates for selected currencies (relative to base)
  const selectedRates = selectedCurrencies.map((code) => ({
    code,
    rate: code === baseCurrency ? 1 : rates[code] || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Currency Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Currencies to Compare</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`currency-${index}`}>
                  Currency {index + 1}
                  {index >= 2 && (
                    <span className="text-muted-foreground ml-1">(optional)</span>
                  )}
                </Label>
                <Select
                  value={selectedCurrencies[index] || ''}
                  onValueChange={(value) => handleCurrencySelect(index, value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id={`currency-${index}`}>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency} - {getCurrencyName(currency)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {hasDuplicates && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select different currencies. Duplicates are not allowed.
              </AlertDescription>
            </Alert>
          )}

          {!hasValidSelection && selectedCurrencies.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select at least 2 currencies to compare.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Comparison View */}
      {hasValidSelection && !hasDuplicates && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedRates.map(({ code, rate }) => (
              <Card key={code} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold">{code}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getCurrencyName(code)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Rate per 1 {baseCurrency}
                    </p>
                    <p className="text-3xl font-bold font-mono">
                      {rate.toFixed(4)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Conversion Widget */}
          <ConversionWidget
            selectedCurrencies={selectedCurrencies}
            baseCurrency={baseCurrency}
            rates={rates}
          />
        </>
      )}
    </div>
  );
}
