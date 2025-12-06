import * as React from "react";
import {
  Autocomplete as MuiAutocomplete,
  TextField,
  CircularProgress,
  AutocompleteProps,
} from "@mui/material";
import { OptionType } from "@/utils/types";

type UniversalAutocompleteProps = Omit<
  AutocompleteProps<OptionType, false, false, false>,
  "renderInput"
> & {
  label: string;
  options?: OptionType[];
  fetchOptions?: () => Promise<OptionType[]>;
};

export const Autocomplete: React.FC<UniversalAutocompleteProps> = ({
  label,
  options = [],
  fetchOptions,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [asyncOptions, setAsyncOptions] = React.useState<OptionType[]>(options);

  const handleOpen = async () => {
    setOpen(true);
    if (fetchOptions) {
      setLoading(true);
      try {
        const fetched = await fetchOptions();
        setAsyncOptions(fetched);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (fetchOptions) {
      setAsyncOptions([]);
    }
  };

  return (
    <MuiAutocomplete
      {...props}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={fetchOptions ? asyncOptions : options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
