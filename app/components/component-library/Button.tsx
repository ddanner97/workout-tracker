import React from 'react';
import {
  Button as MaterialButton,
  ButtonProps as MaterialButtonProps,
} from '@mui/material';

/**
 * Button component — a thin wrapper around MUI's MaterialButton
 * that enforces a required `label` prop for button content.
 *
 * Props extend Material-UI's ButtonProps and add:
 *   - label: string — the text to display inside the button.
 *
 * Usage:
 *   <Button label="Submit" onClick={handler} variant="contained" color="primary" />
 *
 * All other MUI Button props (variant, color, type, disabled, etc.) are supported.
 */

type ButtonProps = MaterialButtonProps & {
  label: string;
};

const Button = ({ label, ...props }: ButtonProps) => {
  return <MaterialButton {...props}>{label}</MaterialButton>;
};

export default Button;
