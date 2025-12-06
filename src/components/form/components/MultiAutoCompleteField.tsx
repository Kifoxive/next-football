import { Controller } from "react-hook-form";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { permissions } from "@/config";
import { PlayerOptionType } from "@/app/[locale]/(authenticated)/players/types";
import { USER_ROLE } from "@/store/auth";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckIcon from "@mui/icons-material/Check";

type MultiAutocompleteFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  noOptionsText: string;
  loadingText: string;
  options: PlayerOptionType[] | null;
  loading?: boolean;
  enforceGlobalModerators?: boolean;
};

export const MultiAutocompleteField: React.FC<MultiAutocompleteFieldProps> = ({
  name,
  label,
  placeholder,
  noOptionsText,
  loadingText,
  options,
  loading = false,
  enforceGlobalModerators = false,
}) => {
  // helpers
  const isGlobalModeratorRole = (role?: USER_ROLE) =>
    !!role && permissions["moderator"].includes(role);

  const globalModeratorOptions =
    (options || []).filter((o) => isGlobalModeratorRole(o.role)) || [];

  return (
    <Controller
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        // ensure global moderators are always present in value (checked) if enforcement is ON
        const safeValue: PlayerOptionType[] = enforceGlobalModerators
          ? [
              ...globalModeratorOptions,
              ...(value || []).filter(
                (v: PlayerOptionType) => !isGlobalModeratorRole(v.role)
              ),
            ]
          : value || [];

        return (
          <Autocomplete
            multiple
            disableClearable
            id={`${name}-autocomplete`}
            options={options || []}
            value={safeValue}
            fullWidth
            disableCloseOnSelect
            loading={loading}
            noOptionsText={noOptionsText}
            loadingText={loadingText}
            onChange={(_event, newValue: PlayerOptionType[]) => {
              if (enforceGlobalModerators) {
                // strip any attempt to add/remove global moderators
                const filtered = newValue.filter(
                  (v) => !isGlobalModeratorRole(v.role)
                );
                // always prepend global moderators
                onChange([...filtered, ...globalModeratorOptions]);
              } else {
                onChange(newValue);
              }
            }}
            isOptionEqualToValue={(option, val) => option.value === val.value}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              const isGlobal =
                enforceGlobalModerators && isGlobalModeratorRole(option.role);

              return (
                <li
                  key={key}
                  {...optionProps}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{option.label}</span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="option-icon"
                  >
                    {isGlobal ? (
                      <ShieldIcon fontSize="small" color="warning" />
                    ) : selected ? (
                      <CheckIcon fontSize="small" color="primary" />
                    ) : null}
                  </span>
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                variant="filled"
                error={!!error}
                helperText={error?.message}
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
      }}
    />
  );
};
