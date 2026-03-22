import React, { useMemo } from 'react';
import type {
  WorkoutMetricsResponse,
  GraphViewMode,
  CustomDateRange,
  WorkoutVolumePoint,
  AggregatedVolumePoint,
} from '../../types/types';
import type { XAxisFormat } from '../component-library/charts/LineGraph';
import { aggregateVolume, autoGroupBy } from '../../utils/aggregateVolume';

import { Box } from '@mui/material';
import { GraphFilters, LineGraph } from '../component-library';

function getXAxisFormat(viewMode: GraphViewMode, customRange: CustomDateRange | null): XAxisFormat {
  if (viewMode === 'month') return 'month';

  if (viewMode === 'year') return 'month';

  if (viewMode === 'custom' && customRange) {
    const days =
      (new Date(customRange.end).getTime() - new Date(customRange.start).getTime()) /
      (1000 * 60 * 60 * 24);
    return autoGroupBy(days) === 'month' ? 'month' : 'day';
  }

  return 'day';
}

const GraphView = ({
  metrics,
  viewMode,
  onViewModeChange,
  customRange,
  onCustomRangeChange,
}: {
  metrics: WorkoutMetricsResponse;
  viewMode: GraphViewMode;
  onViewModeChange: (mode: GraphViewMode) => void;
  customRange: CustomDateRange | null;
  onCustomRangeChange: (range: CustomDateRange) => void;
}) => {
  const rawVolume = metrics?.volumeSeries ?? [];

  const { points, isAggregated } = useMemo(() => {
    if (viewMode === 'workout') {
      return { points: rawVolume, isAggregated: false };
    }

    if (viewMode === 'week' || viewMode === 'year') {
      return { points: aggregateVolume(rawVolume, 'week'), isAggregated: true };
    }

    if (viewMode === 'month') {
      return { points: aggregateVolume(rawVolume, 'month'), isAggregated: true };
    }

    if (viewMode === 'custom' && customRange) {
      const days =
        (new Date(customRange.end).getTime() - new Date(customRange.start).getTime()) /
        (1000 * 60 * 60 * 24);
      const groupBy = autoGroupBy(days);
      return { points: aggregateVolume(rawVolume, groupBy), isAggregated: true };
    }

    return { points: rawVolume, isAggregated: false };
  }, [rawVolume, viewMode, customRange]);

  const xAxisFormat = getXAxisFormat(viewMode, customRange);

  const subtitle = isAggregated
    ? 'Total volume aggregated per period. Hover for details.'
    : 'Tracks total successful volume for each workout in the filtered range.';

  return (
    <>
      <Box sx={{ display: 'grid', gap: 3 }}>
        {isAggregated ? (
          <LineGraph<AggregatedVolumePoint>
            title="Workout Volume Over Time"
            subtitle={subtitle}
            points={points as AggregatedVolumePoint[]}
            emptyMessage="No workouts match the current graph filters."
            yAxisLabel="Volume"
            xAxisFormat={xAxisFormat}
            formatValue={(value) =>
              `${Math.round(value).toLocaleString()} lb-reps`
            }
            getPointValue={(point) => point.volume}
            getTooltipRows={(point) => [
              {
                label: 'Period',
                value: point.periodLabel,
              },
              {
                label: 'Volume',
                value: `${Math.round(point.volume).toLocaleString()} lb-reps`,
              },
              {
                label: 'Workouts',
                value: String(point.workoutCount),
              },
            ]}
            filters={
              <GraphFilters
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
                customRange={customRange}
                onCustomRangeChange={onCustomRangeChange}
              />
            }
            lineColor="#2563eb"
          />
        ) : (
          <LineGraph<WorkoutVolumePoint>
            title="Workout Volume Over Time"
            subtitle={subtitle}
            points={points as WorkoutVolumePoint[]}
            emptyMessage="No workouts match the current graph filters."
            yAxisLabel="Volume"
            xAxisFormat={xAxisFormat}
            formatValue={(value) =>
              `${Math.round(value).toLocaleString()} lb-reps`
            }
            getPointValue={(point) => point.volume}
            getTooltipRows={(point) => [
              {
                label: 'Volume',
                value: `${Math.round(point.volume).toLocaleString()} lb-reps`,
              },
              {
                label: 'Tags',
                value:
                  point.tags.length > 0
                    ? point.tags.map((tag) => `#${tag}`).join(', ')
                    : 'None',
              },
            ]}
            filters={
              <GraphFilters
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
                customRange={customRange}
                onCustomRangeChange={onCustomRangeChange}
              />
            }
            lineColor="#2563eb"
          />
        )}
      </Box>
    </>
  );
};

export default GraphView;
