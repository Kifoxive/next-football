import { Controller } from "react-hook-form";
import {
  // Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  CheckboxProps,
} from "@mui/material";

import { BaseFieldProps } from "../../types";

type TextFieldProps = BaseFieldProps & CheckboxProps & {};

export const CheckboxField: React.FC<TextFieldProps> = ({
  name,
  label,
  ...props
}) => {
  return (
    <Controller
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <FormControl error={Boolean(error?.message)}>
            <FormControlLabel
              control={
                <Checkbox
                  {...props}
                  id={name}
                  defaultChecked
                  value={value}
                  onChange={onChange}
                />
              }
              label={label}
            />
            {error && <FormHelperText error>{error.message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
};
