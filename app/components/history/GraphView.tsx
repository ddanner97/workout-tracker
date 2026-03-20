import React from 'react';
import {
  WorkoutMetricsResponse,
  HistoryGraphRange,
  WorkoutVolumePoint,
} from '../../types/types';

// ─── Component Imports ───
import { Box } from '@mui/material';
import { GraphFilters, LineGraph } from '../component-library';

const GraphView = ({
  metrics,
  range,
  setRange,
}: {
  metrics: WorkoutMetricsResponse;
  range: HistoryGraphRange;
  setRange: (range: HistoryGraphRange) => void;
}) => {
  const volumeSeries = metrics?.volumeSeries ?? [];

  return (
    <>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <LineGraph<WorkoutVolumePoint>
          title="Workout Volume Over Time"
          subtitle="Tracks total successful volume for each workout in the filtered range."
          points={volumeSeries}
          emptyMessage="No workouts match the current graph filters."
          yAxisLabel="Volume"
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
          filters={<GraphFilters range={range} onRangeChange={setRange} />}
          lineColor="#2563eb"
        />
      </Box>
    </>
  );
};

export default GraphView;
