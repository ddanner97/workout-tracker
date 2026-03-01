import { TextFieldProps } from "@mui/material";

export const SET_FIELDS: TextFieldProps[] = [
  {
    label: "Weight (lbs)",
    key: "weight",
    type: "number",
    size: "small",
    inputProps: { min: 0, step: 0.5 },
    required: true,
  },
  {
    label: "Reps",
    key: "reps",
    size: "small",
    placeholder: "5 or fail",
    required: true,
  },
  {
    label: "RPE (optional)",
    key: "rpe",
    type: "number",
    size: "small",
    inputProps: { min: 1, max: 10 },
    placeholder: "optional",
    required: false,
  },
];
