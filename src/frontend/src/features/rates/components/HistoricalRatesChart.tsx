import { useMemo } from 'react';
import type { HistoricalRatePoint } from '../api/historicalRates';

interface HistoricalRatesChartProps {
  data: HistoricalRatePoint[];
  baseCurrency: string;
  targetCurrency: string;
}

export function HistoricalRatesChart({
  data,
  baseCurrency,
  targetCurrency,
}: HistoricalRatesChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) {
      return null;
    }

    // Calculate dimensions
    const width = 800;
    const height = 400;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find min and max values for scaling
    const rates = data.map((d) => d.rate);
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);
    const rateRange = maxRate - minRate;
    const ratePadding = rateRange * 0.1; // 10% padding

    // Scale functions
    const xScale = (index: number) =>
      padding.left + (index / (data.length - 1)) * chartWidth;
    const yScale = (rate: number) =>
      padding.top +
      chartHeight -
      ((rate - minRate + ratePadding) / (rateRange + 2 * ratePadding)) * chartHeight;

    // Generate path
    const pathData = data
      .map((point, index) => {
        const x = xScale(index);
        const y = yScale(point.rate);
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(' ');

    // Generate area path (for fill under line)
    const areaPath =
      pathData +
      ` L ${xScale(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${
        padding.top + chartHeight
      } Z`;

    // Y-axis ticks
    const yTickCount = 5;
    const yTickValues = Array.from({ length: yTickCount }, (_, i) => {
      const value = minRate + (rateRange * i) / (yTickCount - 1);
      return {
        value,
        y: yScale(value),
        label: value.toFixed(4),
      };
    });

    // X-axis ticks (show ~5 dates)
    const xTickCount = Math.min(5, data.length);
    const xTickIndices = Array.from({ length: xTickCount }, (_, i) =>
      Math.floor((i * (data.length - 1)) / (xTickCount - 1))
    );
    const xTickValues = xTickIndices.map((index) => ({
      x: xScale(index),
      label: formatDate(data[index].date),
    }));

    return {
      width,
      height,
      padding,
      pathData,
      areaPath,
      yTickValues,
      xTickValues,
      minRate,
      maxRate,
    };
  }, [data]);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartData.width} ${chartData.height}`}
        className="w-full h-auto"
        style={{ maxHeight: '400px' }}
      >
        {/* Grid lines */}
        {chartData.yTickValues.map((tick, i) => (
          <line
            key={i}
            x1={chartData.padding.left}
            y1={tick.y}
            x2={chartData.width - chartData.padding.right}
            y2={tick.y}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path
          d={chartData.areaPath}
          fill="hsl(var(--primary))"
          fillOpacity="0.1"
        />

        {/* Line */}
        <path
          d={chartData.pathData}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Y-axis */}
        <line
          x1={chartData.padding.left}
          y1={chartData.padding.top}
          x2={chartData.padding.left}
          y2={chartData.height - chartData.padding.bottom}
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1"
        />

        {/* Y-axis labels */}
        {chartData.yTickValues.map((tick, i) => (
          <text
            key={i}
            x={chartData.padding.left - 10}
            y={tick.y}
            textAnchor="end"
            dominantBaseline="middle"
            className="text-xs fill-muted-foreground"
          >
            {tick.label}
          </text>
        ))}

        {/* X-axis */}
        <line
          x1={chartData.padding.left}
          y1={chartData.height - chartData.padding.bottom}
          x2={chartData.width - chartData.padding.right}
          y2={chartData.height - chartData.padding.bottom}
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1"
        />

        {/* X-axis labels */}
        {chartData.xTickValues.map((tick, i) => (
          <text
            key={i}
            x={tick.x}
            y={chartData.height - chartData.padding.bottom + 20}
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {tick.label}
          </text>
        ))}

        {/* Data points */}
        {data.map((point, index) => {
          const x =
            chartData.padding.left +
            (index / (data.length - 1)) *
              (chartData.width - chartData.padding.left - chartData.padding.right);
          const y =
            chartData.padding.top +
            (chartData.height - chartData.padding.top - chartData.padding.bottom) -
            ((point.rate - chartData.minRate) /
              (chartData.maxRate - chartData.minRate)) *
              (chartData.height - chartData.padding.top - chartData.padding.bottom);

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="hsl(var(--primary))"
              className="hover:r-5 transition-all"
            >
              <title>
                {formatDate(point.date)}: {point.rate.toFixed(4)} {targetCurrency}
              </title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
