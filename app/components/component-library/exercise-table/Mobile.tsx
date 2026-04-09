'use client';

import { TextField } from '@mui/material';
import { SetRow } from '../../../types/types';
import { SET_FIELDS } from './constants';

interface ExerciseTableMobileProps {
  sets: SetRow[];
  onAddSet: () => void;
  onRemoveSet: (si: number) => void;
  onUpdateSet: (si: number, field: keyof SetRow, value: string) => void;
}

export default function ExerciseTableMobile({
  sets,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
}: ExerciseTableMobileProps) {
  const handleFieldChange =
    (si: number, field: keyof SetRow) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onUpdateSet(si, field, e.target.value);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Column headers */}
      <div
        className="grid items-center gap-2 px-0"
        style={{ gridTemplateColumns: '24px 1fr 1fr 1fr 24px' }}
      >
        <div />
        {SET_FIELDS.map((field) => (
          <div
            key={field.fieldName}
            className="text-center text-[9px] font-bold uppercase tracking-[1px]"
            style={{ color: 'var(--color-placeholder)' }}
          >
            {field.fieldName === 'weight'
              ? 'Weight'
              : field.fieldName === 'reps'
                ? 'Reps'
                : 'RPE'}
          </div>
        ))}
        <div />
      </div>

      {/* Set rows */}
      {sets.map((set, si) => (
        <div
          key={si}
          className="grid items-center gap-2"
          style={{ gridTemplateColumns: '24px 1fr 1fr 1fr 24px' }}
        >
          <span
            className="text-center text-[11px] font-bold"
            style={{ color: 'var(--color-placeholder)' }}
          >
            {si + 1}
          </span>
          {SET_FIELDS.map((field) => (
            <TextField
              key={field.fieldName}
              type={field.type}
              size="small"
              required={field.required}
              slotProps={{
                htmlInput: {
                  ...field.htmlInputProps,
                  style: { textAlign: 'center', fontSize: 11 },
                },
              }}
              value={set[field.fieldName]}
              onChange={handleFieldChange(si, field.fieldName)}
              placeholder={
                field.fieldName === 'weight'
                  ? 'lbs'
                  : field.fieldName === 'reps'
                    ? 'reps'
                    : 'RPE'
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--color-input-bg)',
                  borderRadius: '10px',
                  height: 39,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-border)',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'var(--color-placeholder)',
                  opacity: 1,
                  fontSize: 11,
                },
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => onRemoveSet(si)}
            className="text-center text-[15px]"
            style={{ color: 'var(--color-placeholder)' }}
            aria-label={`Remove set ${si + 1}`}
          >
            {sets.length > 1 ? '\u00d7' : ''}
          </button>
        </div>
      ))}

      {/* Add set button */}
      <button
        type="button"
        onClick={onAddSet}
        className="mt-1 w-full rounded-[10px] py-2.5 text-[13px] font-bold text-white"
        style={{ backgroundColor: 'var(--color-accent)' }}
      >
        + Add set
      </button>
    </div>
  );
}
