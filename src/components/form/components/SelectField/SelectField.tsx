import { Controller } from "react-hook-form";
import {
  BaseSelectProps,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { BaseFieldProps } from "../../types";
import { OptionType } from "@/utils/types";

type SelectFieldProps = BaseFieldProps &
  BaseSelectProps & {
    options: OptionType[];
  };

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  ...props
}) => {
  return (
    <Controller
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <FormControl
            fullWidth={props.fullWidth}
            error={Boolean(error?.message)}
          >
            <InputLabel id={name + "-label"}>{label}</InputLabel>
            <Select
              {...props}
              labelId={name + "-label"}
              id={name}
              value={value}
              label={label}
              onChange={onChange}
            >
              {options.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
            {Boolean(error?.message) && (
              <FormHelperText color="danger">{error?.message}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};
