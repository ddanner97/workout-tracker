import React, { useState } from 'react';
import { useWorkoutForm } from '../../contexts/WorkoutFormContext';

// ─── Components ───
import { Modal, Box } from '@mui/material';
import { Button } from '../../component-library';

// ─── Styles ───
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid primary.main',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const RemoveExerciseModal = ({ exerciseIndex }: { exerciseIndex: number }) => {
  const { removeExercise } = useWorkoutForm();

  // --- component-level state ───
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <Button
        type="button"
        label="Remove Exercise"
        onClick={() => {
          setOpenModal(true);
        }}
        variant="outlined"
        color="error"
        size="small"
      />
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            ...style,
          }}
        >
          <p className="mb-4 text-center">
            Are you sure you want to remove this exercise?
          </p>
          <Button
            type="button"
            label="Remove Exercise"
            onClick={() => {
              removeExercise(exerciseIndex);
              setOpenModal(false);
            }}
            variant="contained"
            size="small"
          />
        </Box>
      </Modal>
    </>
  );
};

export default RemoveExerciseModal;
