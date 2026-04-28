import { TextField as MuiTextField } from '@mui/material';
import Container from './Container';

import React from 'react';

function TextField({
  label,
  id,
  type,
  onChange,
  required,
}: {
  label: string;
  id: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <>
      <Container column>
        <label
          htmlFor="date"
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
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'var(--color-surface)',
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--color-border)',
              },
            },
          }}
        />
      </Container>
    </>
  );
}

export default TextField;
