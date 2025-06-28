import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FormBuilder } from "./FormBuilder";
import { FieldConfig } from "@/utils/types/formBuilder";

const meta = {
  title: "Form/FormBuilder",
  component: FormBuilder,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof FormBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

const fields: FieldConfig[] = [
  { type: "text", name: "name", label: "Name", defaultValue: "" },
  {
    type: "select",
    name: "color",
    label: "Favorite color",
    options: [
      { label: "Red", value: "red" },
      { label: "Green", value: "green" },
      { label: "Blue", value: "blue" },
    ],
  },
  {
    type: "checkbox",
    name: "agreed",
    label: "Agree to rules",
    defaultValue: false,
  },
  {
    type: "autocomplete",
    name: "country",
    label: "Country",
    options: [
      { label: "Czechia", value: "cz" },
      { label: "Ukraine", value: "ua" },
    ],
  },
  {
    type: "multiselect",
    name: "sports",
    label: "Sports",
    options: [
      { label: "Football", value: "football" },
      { label: "Basketball", value: "basketball" },
    ],
  },
  {
    type: "datetime",
    name: "meeting",
    label: "Meeting date",
    defaultValue: "",
  },
];

export const FullForm: Story = {
  args: {
    fields,
    onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
  },
};
