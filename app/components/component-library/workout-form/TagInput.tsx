'use client';

import { SyntheticEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Autocomplete, Chip, TextField } from '@mui/material';
import { fetchTags } from './info';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ value, onChange }: TagInputProps) {
  const { data: existingTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  const options = existingTags.map((t) => t.name);

  function handleChange(_e: SyntheticEvent, newValue: string[]) {
    const normalized = newValue
      .map((t) => t.replace(/^#/, '').trim().toLowerCase())
      .filter(Boolean);
    const uniqueNormalized = Array.from(new Set(normalized));
    onChange(uniqueNormalized);
  }

  return (
    <Autocomplete
      multiple
      freeSolo
      options={options}
      value={value}
      onChange={handleChange}
      renderTags={(tagValues, getTagProps) =>
        tagValues.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={`#${option}`}
              size="small"
              {...tagProps}
              sx={{
                backgroundColor: 'var(--color-badge-bg)',
                color: 'var(--color-accent)',
                fontWeight: 700,
                '& .MuiChip-deleteIcon': {
                  color: 'var(--color-accent-light)',
                },
              }}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="push, legs, PR day…"
          helperText="Press Enter to add a tag"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'var(--color-surface)',
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--color-border)',
              },
            },
            '& .MuiFormHelperText-root': {
              color: 'var(--color-placeholder)',
              fontSize: 11,
            },
            '& .MuiInputLabel-root': { display: 'none' },
          }}
        />
      )}
    />
  );
}
