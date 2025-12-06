import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type MultiSelectAutocompleteProps = Omit<
  AutocompleteProps<{ label: string; value: string }, false, false, false>,
  "renderInput"
> & {
  defaultValue: [];
};

export default function MultiSelectAutocomplete({
  defaultValue,
  options,
}: MultiSelectAutocompleteProps) {
  return (
    <Autocomplete
      multiple
      id="tags-standard"
      options={options}
      getOptionLabel={(option) => option.label}
      defaultValue={defaultValue}
      fullWidth
      renderInput={(params) => <TextField {...params} variant="standard" />}
    />
  );
}
