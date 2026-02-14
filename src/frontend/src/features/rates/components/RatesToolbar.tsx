import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface RatesToolbarProps {
  lastUpdated?: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export function RatesToolbar({
  lastUpdated,
  onRefresh,
  isLoading,
}: RatesToolbarProps) {
  return (
    <div className="flex items-center gap-4">
      {lastUpdated && (
        <div className="text-sm text-muted-foreground">
          Last updated:{' '}
          <span className="font-medium">
            {format(new Date(lastUpdated), 'MMM dd, yyyy')}
          </span>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}
