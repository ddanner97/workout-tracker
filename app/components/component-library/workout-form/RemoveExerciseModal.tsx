import React, { useState } from 'react';
import { useWorkoutForm } from '../../contexts/WorkoutFormContext';
import { Modal, Box } from '@mui/material';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 340,
  bgcolor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
};

const RemoveExerciseModal = ({ exerciseIndex }: { exerciseIndex: number }) => {
  const { removeExercise } = useWorkoutForm();
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[14px] text-[16px]"
        style={{
          backgroundColor: 'var(--color-input-bg)',
          color: 'var(--color-placeholder)',
        }}
        aria-label="Remove exercise"
      >
        &times;
      </button>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <p
            className="text-center text-[15px] font-medium"
            style={{ color: 'var(--color-heading)' }}
          >
            Remove this exercise?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="rounded-xl px-4 py-2 text-[13px] font-bold"
              style={{
                backgroundColor: 'var(--color-input-bg)',
                color: 'var(--color-body)',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                removeExercise(exerciseIndex);
                setOpenModal(false);
              }}
              className="rounded-xl px-4 py-2 text-[13px] font-bold text-white"
              style={{ backgroundColor: '#dc2626' }}
            >
              Remove
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default RemoveExerciseModal;
