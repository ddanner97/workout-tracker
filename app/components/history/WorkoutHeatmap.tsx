'use client';

import { useMemo, useRef, useEffect, useCallback } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { useColorMode } from '../contexts/ThemeRegistry';
import { formatDate } from '../../utils/utils';
import type { HeatmapData } from '../../utils/buildHeatmapData';

const CELL_SIZE = 13;
const GAP = 2;
const STEP = CELL_SIZE + GAP;
const WEEKS = 52;
const DAYS_IN_WEEK = 7;
const LEFT_LABEL_WIDTH = 28;
const TOP_LABEL_HEIGHT = 20;

const LIGHT_COLORS = ['#e8e6df', '#9fe1cb', '#5dcaa5', '#1d9e75', '#0f6e56'];
const DARK_COLORS = ['#2c2c2a', '#1d503a', '#1d9e75', '#5dcaa5', '#9fe1cb'];

const DAY_LABELS: [number, string][] = [
  [1, 'M'],
  [3, 'W'],
  [5, 'F'],
];

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function getTier(volume: number, maxVolume: number): number {
  if (volume === 0) return 0;
  const ratio = volume / maxVolume;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

type WeekSummary = { weekStart: string; workoutCount: number };

function computeStats(data: HeatmapData, grid: Date[][]) {
  const weekSummaries: WeekSummary[] = grid.map((week) => {
    const weekStart = isoDate(week[0]);
    let count = 0;
    for (const day of week) {
      const entry = data.days.get(isoDate(day));
      if (entry) count += entry.workoutCount;
    }
    return { weekStart, workoutCount: count };
  });

  let currentStreak = 0;
  for (let i = weekSummaries.length - 1; i >= 0; i--) {
    if (weekSummaries[i].workoutCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  const bestWeek = Math.max(...weekSummaries.map((w) => w.workoutCount), 0);

  return { currentStreak, bestWeek };
}

export default function WorkoutHeatmap({ data }: { data: HeatmapData }) {
  const { colorMode } = useColorMode();
  const colors = colorMode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.scrollLeft = node.scrollWidth;
      scrollRef.current = node;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);

  const { grid, monthLabels } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay();
    const endOfGrid = new Date(today);
    endOfGrid.setDate(endOfGrid.getDate() + (6 - dayOfWeek));

    const startOfGrid = new Date(endOfGrid);
    startOfGrid.setDate(startOfGrid.getDate() - WEEKS * 7 + 1);

    const weeks: Date[][] = [];
    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;

    const cursor = new Date(startOfGrid);
    for (let w = 0; w < WEEKS; w++) {
      const week: Date[] = [];
      for (let d = 0; d < DAYS_IN_WEEK; d++) {
        week.push(new Date(cursor));
        const month = cursor.getMonth();
        if (d === 0 && month !== lastMonth) {
          labels.push({ weekIndex: w, label: MONTH_NAMES[month] });
          lastMonth = month;
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    return { grid: weeks, monthLabels: labels };
  }, []);

  const stats = useMemo(() => computeStats(data, grid), [data, grid]);

  const svgWidth = LEFT_LABEL_WIDTH + WEEKS * STEP;
  const svgHeight = TOP_LABEL_HEIGHT + DAYS_IN_WEEK * STEP;

  return (
    <Box sx={{ mb: 4 }}>
      <Box ref={scrollToEnd} sx={{ overflowX: 'auto', pb: 1 }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          role="img"
          aria-label="Workout activity heatmap for the past year"
        >
          {/* Day-of-week labels */}
          {DAY_LABELS.map(([row, label]) => (
            <text
              key={label}
              x={LEFT_LABEL_WIDTH - 6}
              y={TOP_LABEL_HEIGHT + row * STEP + CELL_SIZE * 0.8}
              textAnchor="end"
              fontSize={10}
              fill="currentColor"
              opacity={0.6}
            >
              {label}
            </text>
          ))}

          {/* Month labels */}
          {monthLabels.map(({ weekIndex, label }, i) => (
            <text
              key={`${label}-${i}`}
              x={LEFT_LABEL_WIDTH + weekIndex * STEP}
              y={TOP_LABEL_HEIGHT - 6}
              fontSize={10}
              fill="currentColor"
              opacity={0.6}
            >
              {label}
            </text>
          ))}

          {/* Grid cells */}
          {grid.map((week, wi) =>
            week.map((day, di) => {
              const dateStr = isoDate(day);
              const entry = data.days.get(dateStr);
              const volume = entry?.volume ?? 0;
              const tier = getTier(volume, data.maxVolume);
              const tooltipText =
                volume > 0
                  ? `${formatDate(dateStr)} — ${Math.round(volume).toLocaleString()} lb-reps`
                  : `${formatDate(dateStr)} — Rest day`;

              return (
                <Tooltip key={dateStr} title={tooltipText} arrow>
                  <rect
                    x={LEFT_LABEL_WIDTH + wi * STEP}
                    y={TOP_LABEL_HEIGHT + di * STEP}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    rx={2}
                    fill={colors[tier]}
                  />
                </Tooltip>
              );
            })
          )}
        </svg>
      </Box>

      {/* Summary stats */}
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
          mt: 1.5,
          px: 0.5,
        }}
      >
        <Box>
          <Typography variant="h6" component="span" fontWeight={700}>
            {data.totalWorkouts}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.75 }} component="span">
            workouts this year
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" component="span" fontWeight={700}>
            {stats.currentStreak}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.75 }} component="span">
            week streak
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" component="span" fontWeight={700}>
            {stats.bestWeek}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.75 }} component="span">
            best week
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
