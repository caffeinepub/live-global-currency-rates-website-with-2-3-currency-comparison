import { useState } from 'react';
import { BaseCurrencySelect } from '@/features/rates/components/BaseCurrencySelect';
import { RatesTable } from '@/features/rates/components/RatesTable';
import { RatesToolbar } from '@/features/rates/components/RatesToolbar';
import { CurrencyComparePanel } from '@/features/compare/components/CurrencyComparePanel';
import { HistoricalRatesPanel } from '@/features/rates/components/HistoricalRatesPanel';
import { useLiveRates } from '@/features/rates/hooks/useLiveRates';
import { TrendingUp } from 'lucide-react';
import { SiX, SiGithub } from 'react-icons/si';

export function HomePage() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [selectedTargetCurrency, setSelectedTargetCurrency] = useState<string | null>(null);
  const { data: ratesData, isLoading, isError, refetch } = useLiveRates(baseCurrency);

  const handleOpenHistorical = (targetCurrency: string) => {
    setSelectedTargetCurrency(targetCurrency);
  };

  const handleCloseHistorical = () => {
    setSelectedTargetCurrency(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Currency Exchange
                </h1>
                <p className="text-sm text-muted-foreground">
                  Live rates for 30+ currencies
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Twitter"
              >
                <SiX className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="GitHub"
              >
                <SiGithub className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <BaseCurrencySelect
            value={baseCurrency}
            onChange={setBaseCurrency}
            availableCurrencies={ratesData?.rates ? Object.keys(ratesData.rates) : []}
            isLoading={isLoading}
          />
          <RatesToolbar
            lastUpdated={ratesData?.date}
            onRefresh={refetch}
            isLoading={isLoading}
          />
        </div>

        {/* Historical Chart Panel (conditionally rendered) */}
        {selectedTargetCurrency && (
          <section>
            <HistoricalRatesPanel
              baseCurrency={baseCurrency}
              targetCurrency={selectedTargetCurrency}
              onClose={handleCloseHistorical}
            />
          </section>
        )}

        {/* Rates Table Section */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Exchange Rates</h2>
            <p className="text-sm text-muted-foreground">
              All rates relative to {baseCurrency}
            </p>
          </div>
          <RatesTable
            baseCurrency={baseCurrency}
            rates={ratesData?.rates || {}}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onOpenHistorical={handleOpenHistorical}
          />
        </section>

        {/* Comparison Section */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Currency Comparison</h2>
            <p className="text-sm text-muted-foreground">
              Compare 2 or 3 currencies side-by-side
            </p>
          </div>
          <CurrencyComparePanel
            baseCurrency={baseCurrency}
            rates={ratesData?.rates || {}}
            isLoading={isLoading}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Currency Exchange. Data provided by{' '}
              <a
                href="https://www.frankfurter.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Frankfurter API
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'currency-exchange'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
