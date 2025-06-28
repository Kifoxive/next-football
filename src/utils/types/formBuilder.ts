// types/formBuilder.ts
export type FieldType =
  | "text"
  | "select"
  | "checkbox"
  | "datetime"
  | "autocomplete"
  | "multiselect";

export interface FieldConfig {
  type: FieldType;
  name: string;
  label: string;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  rules?: any;
}
