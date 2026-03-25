import { Paper, Stack, Typography } from '@mui/material';

interface GraphTooltipRow {
  label: string;
  value: string;
}

interface GraphTooltipContentProps {
  title: string;
  rows: GraphTooltipRow[];
}

export default function GraphTooltipContent({
  title,
  rows,
}: GraphTooltipContentProps) {
  return (
    <Paper variant="outlined" sx={{ px: 1.5, py: 1 }}>
      <Stack spacing={0.75}>
        <Typography variant="subtitle2">{title}</Typography>
        {rows.map((row) => (
          <Stack
            key={row.label}
            direction="row"
            spacing={1}
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary">
              {row.label}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {row.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

export type { GraphTooltipRow };
