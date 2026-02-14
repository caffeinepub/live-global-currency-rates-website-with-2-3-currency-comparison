# Specification

## Summary
**Goal:** Add a historical exchange-rate chart view for any currency in the rates table, showing how it changes over time relative to the currently selected base currency.

**Planned changes:**
- Add an entry point in the existing searchable/sortable rates table to open/close a historical chart view for a selected target currency without affecting current table search/sort state.
- Implement a historical view UI that fetches and displays exchange-rate history for (base currency, selected target currency) from the existing Frankfurter API base URL (https://api.frankfurter.app), with loading/error states consistent with the app.
- Add date-range presets (7D, 1M, 3M, 1Y) within the historical view and update the chart when the selected range changes.
- Create a dedicated historical-rates fetcher and React Query hook (separate from live rates) caching by (baseCurrency, targetCurrency, dateRange), including a manual refresh action and retry on failures.

**User-visible outcome:** From the rates table, users can open a historical chart for a currency, switch between common date ranges, and refresh/retry data loading while keeping the rest of the rates table behavior (search/sort) unchanged.
