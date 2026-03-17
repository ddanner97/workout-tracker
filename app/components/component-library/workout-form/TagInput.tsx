"use client";

import { SyntheticEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { Tag } from "../../../types/types";

async function fetchTags(): Promise<Tag[]> {
  const res = await fetch("/api/tags");
  if (!res.ok) throw new Error("Failed to fetch tags");
  return res.json();
}

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ value, onChange }: TagInputProps) {
  const { data: existingTags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const options = existingTags.map((t) => t.name);

  function handleChange(_e: SyntheticEvent, newValue: string[]) {
    const normalized = newValue
      .map((t) => t.replace(/^#/, "").trim().toLowerCase())
      .filter(Boolean);
    onChange(normalized);
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
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tags (optional)"
          placeholder="e.g. push-pull, upper-body"
          helperText="Press Enter to add a tag"
        />
      )}
    />
  );
}
