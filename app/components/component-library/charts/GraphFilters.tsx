"use client";

import { useState } from "react";
import {
  Box,
  IconButton,
  Popover,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import type { GraphViewMode, CustomDateRange } from "../../../types/types";

const VIEW_MODE_OPTIONS: { value: GraphViewMode; label: string }[] = [
  { value: "workout", label: "Per Workout" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "year", label: "Year" },
  { value: "custom", label: "Custom" },
];

interface GraphFiltersProps {
  viewMode: GraphViewMode;
  onViewModeChange: (mode: GraphViewMode) => void;
  customRange: CustomDateRange | null;
  onCustomRangeChange: (range: CustomDateRange) => void;
}

export default function GraphFilters({
  viewMode,
  onViewModeChange,
  customRange,
  onCustomRangeChange,
}: GraphFiltersProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const toggleGroup = (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={viewMode}
      onChange={(_event, next: GraphViewMode | null) => {
        if (next) {
          onViewModeChange(next);
          if (next !== "custom") setAnchorEl(null);
        }
      }}
      aria-label="Select graph view mode"
    >
      {VIEW_MODE_OPTIONS.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );

  const today = new Date().toISOString().split("T")[0];

  const dateInputs = viewMode === "custom" && (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: { xs: 1, md: 0 } }}>
      <TextField
        type="date"
        size="small"
        label="Start"
        required
        value={customRange?.start ?? ""}
        onChange={(e) => {
          const start = e.target.value;
          if (!start) return;
          const end = customRange?.end && customRange.end >= start ? customRange.end : start;
          onCustomRangeChange({ start, end });
        }}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { max: customRange?.end || today },
        }}
        sx={{ width: 160 }}
      />
      <TextField
        type="date"
        size="small"
        label="End"
        required
        value={customRange?.end ?? ""}
        onChange={(e) => {
          const end = e.target.value;
          if (!end) return;
          const start = customRange?.start && customRange.start <= end ? customRange.start : end;
          onCustomRangeChange({ start, end });
        }}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { min: customRange?.start || undefined, max: today },
        }}
        sx={{ width: 160 }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* Desktop: inline toggle + date fields */}
      <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center", flexWrap: "wrap" }}>
        {toggleGroup}
        {dateInputs}
      </Box>

      {/* Mobile: filter icon + popover */}
      <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Open graph filters"
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
          <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
            {toggleGroup}
            {dateInputs}
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
