import { Button } from '@/components/ui/button';
import { type DateRangePreset, getPresetLabel } from '../lib/dateRanges';

interface DateRangePresetsProps {
  selectedRange: DateRangePreset;
  onRangeChange: (range: DateRangePreset) => void;
}

const PRESETS: DateRangePreset[] = ['7D', '1M', '3M', '1Y'];

export function DateRangePresets({ selectedRange, onRangeChange }: DateRangePresetsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PRESETS.map((preset) => (
        <Button
          key={preset}
          variant={selectedRange === preset ? 'default' : 'outline'}
          size="sm"
          onClick={() => onRangeChange(preset)}
        >
          {getPresetLabel(preset)}
        </Button>
      ))}
    </div>
  );
}
