import { Controller } from "react-hook-form";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  AutocompleteProps,
  TextField,
} from "@mui/material";

import { BaseFieldProps } from "../../types";
import { OptionType } from "@/types";

type AutocompleteFieldProps = BaseFieldProps &
  Omit<AutocompleteProps<OptionType, false, false, false>, "renderInput"> & {
    options: OptionType[];
    number: boolean;
  };

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  name,
  label,
  options,
  number,
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
            <Autocomplete
              {...props}
              disablePortal
              options={options}
              id={name}
              value={options.find((option) => option.value === value) || null}
              onChange={(_event, newValue) =>
                onChange(number ? Number(newValue?.value) : newValue?.value)
              }
              renderInput={(params) => <TextField {...params} label={label} />}
            />
            {Boolean(error?.message) && (
              <FormHelperText color="danger">{error?.message}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};
