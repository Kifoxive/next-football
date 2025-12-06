import { Controller } from "react-hook-form";
import { FormControl, FormHelperText } from "@mui/material";

import { BaseFieldProps } from "../../types";
import { OptionType } from "@/utils/types";
import { Autocomplete } from "@/components/Autocomplete";

type AutocompleteFieldProps = BaseFieldProps & {
  options?: OptionType[];
  fetchOptions?: () => Promise<OptionType[]>;
  number?: boolean;
};

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  name,
  label,
  options,
  fetchOptions,
  number,
  ...props
}) => {
  return (
    <Controller
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <FormControl error={Boolean(error?.message)} fullWidth>
          <Autocomplete
            {...props}
            label={label}
            options={options ?? []}
            fetchOptions={fetchOptions}
            id={name}
            value={
              (options ?? []).find((option) => option.value === value) || null
            }
            onChange={(_event, newValue) =>
              onChange(number ? Number(newValue?.value) : newValue?.value)
            }
          />
          {Boolean(error?.message) && (
            <FormHelperText>{error?.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
