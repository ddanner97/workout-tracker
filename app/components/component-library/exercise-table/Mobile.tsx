'use client';

import { TextField } from '@mui/material';
import { SetRow, WeightUnit } from '../../../types/types';
import { lbsToKgs, kgsToLbs } from '../../../utils/utils';
import { SET_FIELDS } from './constants';

interface ExerciseTableMobileProps {
  sets: SetRow[];
  onAddSet: () => void;
  onRemoveSet: (si: number) => void;
  onUpdateSet: (si: number, field: keyof SetRow, value: string) => void;
  weightUnit: WeightUnit;
  onToggleWeightUnit: () => void;
}

export default function ExerciseTableMobile({
  sets,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  weightUnit,
  onToggleWeightUnit,
}: ExerciseTableMobileProps) {
  const isKgs = weightUnit === 'kgs';

  function displayWeight(lbsValue: string): string {
    if (!lbsValue) return '';
    return isKgs ? lbsToKgs(lbsValue) : lbsValue;
  }

  function handleWeightChange(
    si: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const raw = e.target.value;
    onUpdateSet(si, 'weight', isKgs ? kgsToLbs(raw) : raw);
  }

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
            {field.fieldName === 'weight' ? (
              <button
                type="button"
                onClick={onToggleWeightUnit}
                className="cursor-pointer text-[9px] font-bold uppercase tracking-[1px]"
                style={{
                  color: 'var(--color-accent)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                {weightUnit}
              </button>
            ) : field.fieldName === 'reps' ? (
              'Reps'
            ) : (
              'RPE'
            )}
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
                  style: { textAlign: 'center', fontSize: 16 },
                },
              }}
              value={
                field.fieldName === 'weight'
                  ? displayWeight(set.weight)
                  : set[field.fieldName]
              }
              onChange={
                field.fieldName === 'weight'
                  ? (e: React.ChangeEvent<HTMLInputElement>) =>
                      handleWeightChange(si, e)
                  : handleFieldChange(si, field.fieldName)
              }
              placeholder={
                field.fieldName === 'weight'
                  ? weightUnit
                  : field.fieldName === 'reps'
                    ? 'reps'
                    : 'RPE'
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--color-input-bg)',
                  borderRadius: '10px',
                  height: 42,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-border)',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'var(--color-placeholder)',
                  opacity: 1,
                  fontSize: 16,
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
