// Date range utilities for historical rate queries

export type DateRangePreset = '7D' | '1M' | '3M' | '1Y';

export interface DateRange {
  startDate: string; // ISO date format YYYY-MM-DD
  endDate: string;   // ISO date format YYYY-MM-DD
}

/**
 * Computes start and end dates for a given preset range
 * @param preset - The date range preset (7D, 1M, 3M, 1Y)
 * @returns DateRange with ISO-formatted start and end dates
 */
export function computeDateRange(preset: DateRangePreset): DateRange {
  const endDate = new Date();
  const startDate = new Date();

  switch (preset) {
    case '7D':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '1M':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case '3M':
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case '1Y':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
  }

  return {
    startDate: formatDateISO(startDate),
    endDate: formatDateISO(endDate),
  };
}

/**
 * Formats a Date object to ISO date string (YYYY-MM-DD)
 */
function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets a human-readable label for a date range preset
 */
export function getPresetLabel(preset: DateRangePreset): string {
  const labels: Record<DateRangePreset, string> = {
    '7D': '7 Days',
    '1M': '1 Month',
    '3M': '3 Months',
    '1Y': '1 Year',
  };
  return labels[preset];
}
