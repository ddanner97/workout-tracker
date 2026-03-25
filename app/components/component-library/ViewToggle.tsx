'use client';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ViewToggleProps<T extends string> {
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
}

export default function ViewToggle<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: ViewToggleProps<T>) {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      size="small"
      color="primary"
      aria-label={ariaLabel}
      onChange={(_event, nextValue: T | null) => {
        if (nextValue) {
          onChange(nextValue);
        }
      }}
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          sx={{ minWidth: 68 }}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
