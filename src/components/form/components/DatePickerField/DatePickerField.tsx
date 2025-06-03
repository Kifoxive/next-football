// import { Controller } from "react-hook-form";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
// import { Dayjs, unix } from "dayjs";

// import { BaseFieldProps } from "../../types";

// import styles from "./DatePickerField.module.scss";

// interface DatePickerFieldProps extends BaseFieldProps {}

// export const DatePickerField: React.FC<DatePickerFieldProps> = ({
//   name,
//   label,
// }) => {
//   return (
//     <Controller
//       name={name}
//       render={({ field: { value, onChange } }) => {
//         const onInputChange = (e: Dayjs | null) => {
//           onChange(e ? e.unix() * 1000 : null);
//         };
//         return (
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DatePicker
//               label={label}
//               value={value ? unix(value / 1000) : null}
//               onChange={onInputChange}
//               name={name}
//               format="DD.MM.YYYY"
//               className={styles.field}
//             />
//           </LocalizationProvider>
//         );
//       }}
//     />
//   );
// };
