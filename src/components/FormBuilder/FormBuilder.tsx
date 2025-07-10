import { useForm, FormProvider } from "react-hook-form";
import { TextField } from "../form";
import {
  CheckboxField,
  SelectField,
  AutocompleteField,
  // MultiSelectField,
  DateTimePickerField,
} from "../form";
import { FieldConfig } from "@/utils/types/formBuilder";

interface FormBuilderProps {
  fields: FieldConfig[];
  onSubmit?: (data: Record<string, unknown>) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  onSubmit,
}) => {
  const methods = useForm({
    defaultValues: Object.fromEntries(
      fields.map((f) => [
        f.name,
        f.defaultValue ?? (f.type === "checkbox" ? false : ""),
      ])
    ),
  });

  const renderField = (field: FieldConfig) => {
    const props = {
      key: field.name,
      name: field.name,
      label: field.label,
      options: field.options,
      rules: field.rules,
      fullWidth: true,
    };

    switch (field.type) {
      case "text":
        return <TextField {...props} />;
      case "checkbox":
        return <CheckboxField {...props} />;
      case "select":
        return <SelectField {...props} options={field.options ?? []} />;
      case "autocomplete":
        return (
          <AutocompleteField
            {...props}
            options={field.options ?? []}
            number={false}
          />
        );
      // case "multiselect":
      //   return <MultiSelectField {...props} options={field.options ?? []} />;
      case "datetime":
        return <DateTimePickerField {...props} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => {
          onSubmit?.(data);
        })}
        className="flex flex-col gap-4 p-4 max-w-md space-y-4"
      >
        {fields.map(renderField)}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
};
