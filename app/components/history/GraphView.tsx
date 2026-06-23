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

function customRangeDays(range: CustomDateRange): number {
  return (
    (new Date(range.end).getTime() - new Date(range.start).getTime()) /
    (1000 * 60 * 60 * 24)
  );
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
  const rawVolume = useMemo(() => metrics?.volumeSeries ?? [], [metrics]);

  const { points, isAggregated, xAxisFormat } = useMemo<{
    points: WorkoutVolumePoint[] | AggregatedVolumePoint[];
    isAggregated: boolean;
    xAxisFormat: XAxisFormat;
  }>(() => {
    if (viewMode === 'workout') {
      return { points: rawVolume, isAggregated: false, xAxisFormat: 'day' };
    }

    if (viewMode === 'week') {
      return {
        points: aggregateVolume(rawVolume, 'week'),
        isAggregated: true,
        xAxisFormat: 'day',
      };
    }

    if (viewMode === 'year') {
      return {
        points: aggregateVolume(rawVolume, 'week'),
        isAggregated: true,
        xAxisFormat: 'month',
      };
    }

    if (viewMode === 'month') {
      return {
        points: aggregateVolume(rawVolume, 'month'),
        isAggregated: true,
        xAxisFormat: 'month',
      };
    }

    if (viewMode === 'custom' && customRange) {
      const groupBy = autoGroupBy(customRangeDays(customRange));
      return {
        points: aggregateVolume(rawVolume, groupBy),
        isAggregated: true,
        xAxisFormat: groupBy === 'month' ? 'month' : 'day',
      };
    }

    return { points: rawVolume, isAggregated: false, xAxisFormat: 'day' };
  }, [rawVolume, viewMode, customRange]);

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
          />
        )}
      </Box>
    </>
  );
};

export default GraphView;
