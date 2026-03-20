"use client";

import { useState } from "react";
import { Box, IconButton, Popover, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { HistoryGraphRange } from "../../../types/types";

const RANGE_OPTIONS: { value: HistoryGraphRange; label: string }[] = [
  { value: "all", label: "All" },
  { value: "30", label: "30d" },
  { value: "90", label: "90d" },
  { value: "180", label: "180d" },
];

interface GraphFiltersProps {
  range: HistoryGraphRange;
  onRangeChange: (range: HistoryGraphRange) => void;
}

export default function GraphFilters({
  range,
  onRangeChange,
}: GraphFiltersProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const toggleGroup = (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={range}
      onChange={(_event, nextRange: HistoryGraphRange | null) => {
        if (nextRange) {
          onRangeChange(nextRange);
          setAnchorEl(null);
        }
      }}
      aria-label="Select graph time range"
    >
      {RANGE_OPTIONS.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      {/* Desktop: inline toggle buttons */}
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        {toggleGroup}
      </Box>

      {/* Mobile: filter icon + popover */}
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Open range filter"
        >
          <FilterList />
        </IconButton>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box sx={{ p: 1 }}>
            {toggleGroup}
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
