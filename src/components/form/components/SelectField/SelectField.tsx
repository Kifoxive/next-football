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
import React from "react";

type SelectFieldProps = BaseFieldProps &
  BaseSelectProps & {
    options: OptionType[];
    additionalOption?: {
      label: string;
      icon: React.ReactElement;
      onClick: () => void;
    };
  };

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  additionalOption,
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
              onChange={({ target: { value } }) => {
                if (value === "_") return;
                onChange(value);
              }}
            >
              {options.map(({ label, value }, index) => (
                <MenuItem
                  key={value}
                  value={value}
                  divider={additionalOption && index === options.length - 1}
                >
                  {label}
                </MenuItem>
              ))}
              {additionalOption && (
                <MenuItem
                  value="_"
                  onClick={additionalOption.onClick}
                  sx={{
                    // fontStyle: "italic",
                    color: "primary.main",
                  }}
                >
                  {additionalOption.icon}
                  {additionalOption.label}
                </MenuItem>
              )}
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
