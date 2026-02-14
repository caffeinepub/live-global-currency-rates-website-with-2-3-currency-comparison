import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCurrencyName } from '@/features/rates/currencyMeta';
import { convertCurrency } from '../lib/conversion';
import { ArrowRight } from 'lucide-react';

interface ConversionWidgetProps {
  selectedCurrencies: string[];
  baseCurrency: string;
  rates: Record<string, number>;
}

export function ConversionWidget({
  selectedCurrencies,
  baseCurrency,
  rates,
}: ConversionWidgetProps) {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState(selectedCurrencies[0]);

  const numericAmount = parseFloat(amount) || 0;

  const conversions = selectedCurrencies
    .filter((code) => code !== fromCurrency)
    .map((toCurrency) => ({
      currency: toCurrency,
      amount: convertCurrency(
        numericAmount,
        fromCurrency,
        toCurrency,
        baseCurrency,
        rates
      ),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Currency Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="from-currency">From Currency</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger id="from-currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedCurrencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency} - {getCurrencyName(currency)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conversion Results */}
        <div className="space-y-3">
          <Label className="text-sm text-muted-foreground">Converted Amounts</Label>
          <div className="space-y-2">
            {conversions.map(({ currency, amount: convertedAmount }) => (
              <div
                key={currency}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{currency}</p>
                    <p className="text-xs text-muted-foreground">
                      {getCurrencyName(currency)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold font-mono">
                    {convertedAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">{currency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
