import { TextFieldProps } from "@mui/material";
import { SetRow } from "../../../types/types";

export interface SetFieldConfig
  extends Pick<TextFieldProps, "label" | "type" | "size" | "placeholder" | "required" | "inputProps"> {
  fieldName: keyof SetRow;
}

export const SET_FIELDS: SetFieldConfig[] = [
  {
    label: "Weight (lbs)",
    fieldName: "weight",
    type: "number",
    size: "small",
    inputProps: { min: 0, step: 0.5 },
    required: true,
  },
  {
    label: "Reps",
    fieldName: "reps",
    size: "small",
    placeholder: "5 or fail",
    required: true,
  },
  {
    label: "RPE (optional)",
    fieldName: "rpe",
    type: "number",
    size: "small",
    inputProps: { min: 1, max: 10 },
    placeholder: "optional",
    required: false,
  },
];
