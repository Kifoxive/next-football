// types/formBuilder.ts
export type FieldType =
  | "text"
  | "select"
  | "checkbox"
  | "datetime"
  | "autocomplete";
// | "multiselect";

export interface FieldConfig {
  type: FieldType;
  name: string;
  label: string;
  defaultValue?: string | number | boolean | Date | string[] | number[] | null;
  options?: { label: string; value: string | number }[];
  rules?: string | number | boolean | Date | string[] | number[] | null;
}
