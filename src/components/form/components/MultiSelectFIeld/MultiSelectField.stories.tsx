import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MultiSelectField } from "./MultiSelectField";
import { useForm, FormProvider } from "react-hook-form";
import React, { useEffect } from "react";

const options = [
  { label: "Football", value: "football" },
  { label: "Basketball", value: "basketball" },
  { label: "Volleyball", value: "volleyball" },
  { label: "Tennis", value: "tennis" },
];

const meta = {
  title: "Form/MultiSelectField",
  component: MultiSelectField,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "sports",
    label: "Select Sports",
    options,
    fullWidth: true,
  },
} satisfies Meta<typeof MultiSelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

const WithForm = (args: any) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: args.defaultValue ?? [],
    },
  });

  return (
    <FormProvider {...methods}>
      <form className="p-4 min-w-[200px]">
        <MultiSelectField {...args} />
      </form>
    </FormProvider>
  );
};

export const Default: Story = {
  render: (args) => <WithForm {...args} />,
};

export const Preselected: Story = {
  render: (args) => <WithForm {...args} />,
  args: {
    // @ts-ignore
    defaultValue: ["football", "tennis"],
  },
};

export const WithError: Story = {
  render: (args) => {
    const methods = useForm({
      defaultValues: {
        [args.name]: [],
      },
    });

    useEffect(() => {
      methods.setError(args.name, { message: "Error message" });
    }, []);

    return (
      <FormProvider {...methods}>
        <form className="p-4 min-w-[200px]">
          <MultiSelectField {...args} />
        </form>
      </FormProvider>
    );
  },
  args: {},
};
