import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AutocompleteField } from "./AutocompleteField";
import { useForm, FormProvider } from "react-hook-form";
import React, { useEffect } from "react";
import type { OptionType } from "@/utils/types";

const options: OptionType[] = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
];

const meta = {
  title: "Form/AutocompleteField",
  component: AutocompleteField,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "example",
    label: "Choose option",
    options,
    number: false,
    fullWidth: true,
  },
} satisfies Meta<typeof AutocompleteField>;

export default meta;
type Story = StoryObj<typeof meta>;

const WithForm = (args: any) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: args.defaultValue || "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form className="p-4 w-[250px]">
        <AutocompleteField {...args} />
      </form>
    </FormProvider>
  );
};

export const Default: Story = {
  render: (args) => <WithForm {...args} />,
};

export const WithNumber: Story = {
  render: (args) => <WithForm {...args} />,
  args: {
    number: true,
    options: [
      { label: "One", value: 1 },
      { label: "Two", value: 2 },
      { label: "Three", value: 3 },
    ],
  },
};

export const Preselected: Story = {
  render: (args) => <WithForm {...args} />,
  args: {
    // @ts-ignore
    defaultValue: "b",
    options,
  },
};

export const WithError: Story = {
  render: (args) => {
    const methods = useForm({
      defaultValues: {
        [args.name]: "",
      },
    });

    useEffect(() => {
      methods.setError(args.name, { message: "Error message" });
    }, []);

    return (
      <FormProvider {...methods}>
        <form className="p-4 w-[200px]">
          <AutocompleteField {...args} />
        </form>
      </FormProvider>
    );
  },
};
