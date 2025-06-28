import { Controller } from "react-hook-form";
import {
  CircularProgress,
  InputAdornment,
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material";

import { BaseFieldProps } from "../../types";

export type TextFieldProps = BaseFieldProps &
  MuiTextFieldProps & {
    type?: "text" | "number" | "password" | "array";
    isLoading?: boolean;
  };

export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  type = "text",
  isLoading = false,
  ...props
}) => {
  return (
    <Controller
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <MuiTextField
            InputProps={{
              endAdornment: isLoading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
            {...props}
            type={type}
            id={name}
            label={label}
            value={type === "array" ? value && value.join(", ") : value}
            onChange={(e) =>
              onChange(
                type === "number"
                  ? e.target.value && Number(e.target.value)
                  : type === "array"
                    ? e.target.value && e.target.value.split(", ")
                    : e
              )
            }
            name={name}
            error={Boolean(error?.message)}
            helperText={error?.message}
          />
        );
      }}
    />
  );
};
