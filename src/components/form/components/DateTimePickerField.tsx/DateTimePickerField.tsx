import { Controller } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import {
  DateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";

import { BaseFieldProps } from "../../types";
// import { FormControl } from "@mui/material";

type DateTimePickerFieldProps = BaseFieldProps & DateTimePickerProps & {};

export const DateTimePickerField: React.FC<DateTimePickerFieldProps> = ({
  name,
  label,
  ...props
}) => {
  return (
    <Controller
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const onInputChange = (e: Dayjs | null) => {
          onChange(e ? e.toISOString() : null);
        };
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* <FormControl error={Boolean(error?.message)}> */}
            <DateTimePicker
              {...props}
              label={label}
              value={value ? dayjs(value) : null}
              onChange={onInputChange}
              name={name}
              format="DD.MM.YYYY hh:mm"
              className={"w-full"}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
            {/* </FormControl> */}
          </LocalizationProvider>
        );
      }}
    />
  );
};
