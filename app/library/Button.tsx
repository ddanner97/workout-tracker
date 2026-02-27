import React from "react";
import {
  Button as MaterialButton,
  ButtonProps as MaterialButtonProps,
} from "@mui/material";

type ButtonProps = MaterialButtonProps & {
  label: string;
};

const Button = ({ label, ...props }: ButtonProps) => {
  return <MaterialButton {...props}>{label}</MaterialButton>;
};

export default Button;
