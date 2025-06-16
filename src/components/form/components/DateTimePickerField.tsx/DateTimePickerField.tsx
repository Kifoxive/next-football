import { Controller } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { BaseFieldProps } from "../../types";

type DateTimePickerFieldProps = BaseFieldProps & {};

export const DateTimePickerField: React.FC<DateTimePickerFieldProps> = ({
  name,
  label,
  ...props
}) => {
  return (
    <Controller
      name={name}
      render={({ field: { value, onChange } }) => {
        const onInputChange = (e: Dayjs | null) => {
          onChange(e ? e.toISOString() : null);
        };
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label={label}
              value={value ? dayjs(value) : null}
              onChange={onInputChange}
              name={name}
              format="DD.MM.YYYY hh:mm"
              {...props}
              className={"w-full"}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
};
