import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getCurrencyName } from '../currencyMeta';

interface BaseCurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  availableCurrencies: string[];
  isLoading?: boolean;
}

export function BaseCurrencySelect({
  value,
  onChange,
  availableCurrencies,
  isLoading,
}: BaseCurrencySelectProps) {
  // Add the current base currency to available currencies if not present
  const allCurrencies = Array.from(
    new Set([value, ...availableCurrencies])
  ).sort();

  return (
    <div className="space-y-2">
      <Label htmlFor="base-currency" className="text-sm font-medium">
        Base Currency
      </Label>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger id="base-currency" className="w-[200px]">
          <SelectValue placeholder="Select base currency" />
        </SelectTrigger>
        <SelectContent>
          {allCurrencies.map((currency) => (
            <SelectItem key={currency} value={currency}>
              {currency} - {getCurrencyName(currency)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
