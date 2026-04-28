import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import Container from './Container';

import React from 'react';

function TextField({
  label,
  id,
  type,
  onChange,
  required,
  value,
  defaultValue,
  multiline,
  minRows,
  fullWidth,
  placeholder,
  size = 'small',
  slotProps,
}: {
  label: string;
  id: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  multiline?: boolean;
  minRows?: number;
  fullWidth?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
  slotProps?: TextFieldProps['slotProps'];
}) {
  return (
    <Container column gap={6}>
      <label
        htmlFor={id}
        className="text-[11px] font-bold tracking-[1px] uppercase"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </label>
      <MuiTextField
        id={id}
        type={type}
        onChange={onChange}
        required={required}
        value={value}
        defaultValue={defaultValue}
        multiline={multiline}
        minRows={minRows}
        fullWidth={fullWidth}
        placeholder={placeholder}
        size={size}
        slotProps={slotProps}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--color-surface)',
            borderRadius: '12px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-border)',
            },
          },
          '& .MuiInputLabel-root': { display: 'none' },
        }}
      />
    </Container>
  );
}

export default TextField;
