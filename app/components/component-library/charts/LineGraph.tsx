'use client';

import {
  Box,
  Tooltip as MuiTooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  ChartsTooltipContainer,
  type ChartsTooltipProps,
  LineChart,
  useItemTooltip,
} from '@mui/x-charts';
import GraphTooltipContent, { GraphTooltipRow } from './GraphTooltipContent';

interface LineGraphPoint {
  workoutId: string;
  performedAt: string;
}

interface LineGraphProps<TPoint extends LineGraphPoint> {
  title: string;
  subtitle?: string;
  points: TPoint[];
  emptyMessage: string;
  yAxisLabel: string;
  formatValue: (value: number) => string;
  getPointValue: (point: TPoint) => number;
  getTooltipRows: (point: TPoint) => GraphTooltipRow[];
  lineColor?: string;
}

const axisDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

function tooltipDateLabel(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function axisValueFormatter(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `${Math.round(value).toLocaleString()}`;
  }

  return `${Math.round(value * 10) / 10}`;
}

export default function LineGraph<TPoint extends LineGraphPoint>({
  title,
  subtitle,
  points,
  emptyMessage,
  yAxisLabel,
  formatValue,
  getPointValue,
  getTooltipRows,
  lineColor,
  filters,
}: LineGraphProps<TPoint> & { filters?: React.ReactNode }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  if (points.length === 0) {
    return (
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 1,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="h6">{title}</Typography>
            {isSmall && subtitle && (
              <MuiTooltip title={subtitle} arrow>
                <InfoOutlinedIcon fontSize="small" color="action" />
              </MuiTooltip>
            )}
          </Box>
          {filters}
        </Box>
        {!isSmall && subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  const Tooltip = (props: ChartsTooltipProps) => {
    const tooltipData = useItemTooltip<'line'>();
    const dataIndex = tooltipData?.identifier.dataIndex;

    if (dataIndex == null) {
      return null;
    }

    const point = points[dataIndex];
    if (!point) {
      return null;
    }

    return (
      <ChartsTooltipContainer {...props}>
        <GraphTooltipContent
          title={tooltipDateLabel(point.performedAt)}
          rows={getTooltipRows(point)}
        />
      </ChartsTooltipContainer>
    );
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        p: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 1,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="h6">{title}</Typography>
          {isSmall && subtitle && (
            <MuiTooltip
              title={subtitle}
              arrow
              enterTouchDelay={0}
              enterDelay={0}
            >
              <span
                tabIndex={0}
                role="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <InfoOutlinedIcon fontSize="small" color="action" />
              </span>
            </MuiTooltip>
          )}
        </Box>
        {filters}
      </Box>
      {!isSmall && subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      <LineChart
        height={320}
        grid={{ horizontal: true }}
        hideLegend
        axisHighlight={{ x: 'line', y: 'none' }}
        xAxis={[
          {
            data: points.map((point) => new Date(point.performedAt)),
            scaleType: 'time',
            valueFormatter: (value: Date) =>
              value instanceof Date ? axisDateFormatter.format(value) : '',
          },
        ]}
        yAxis={[
          {
            label: yAxisLabel,
            valueFormatter: (value: number) =>
              typeof value === 'number' ? axisValueFormatter(value) : '',
          },
        ]}
        series={[
          {
            data: points.map((point) => getPointValue(point)),
            label: title,
            color: lineColor,
            curve: 'monotoneX',
            showMark: true,
            valueFormatter: (value) =>
              typeof value === 'number' ? formatValue(value) : '',
          },
        ]}
        slots={{ tooltip: Tooltip }}
        slotProps={{ tooltip: { trigger: 'item' } }}
        margin={{ top: 16, right: 24, bottom: 24, left: 48 }}
      />
    </Box>
  );
}
