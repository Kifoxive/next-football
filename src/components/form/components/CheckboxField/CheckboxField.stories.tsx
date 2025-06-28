import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CheckboxField } from "./CheckboxField";
import { useForm, FormProvider } from "react-hook-form";
import React, { useEffect } from "react";

const meta = {
  title: "Form/CheckboxField",
  component: CheckboxField,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "acceptTerms",
    label: "I accept the terms and conditions",
  },
} satisfies Meta<typeof CheckboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

const WithForm = (args: any) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: args.defaultValue ?? false,
    },
  });

  return (
    <FormProvider {...methods}>
      <form className="p-4 max-w-sm">
        <CheckboxField {...args} />
      </form>
    </FormProvider>
  );
};

export const Default: Story = {
  render: (args) => <WithForm {...args} />,
};

export const CheckedByDefault: Story = {
  render: (args) => <WithForm {...args} />,
  args: {
    checked: true,
  },
};

export const WithError: Story = {
  render: (args) => {
    const methods = useForm({
      defaultValues: {
        [args.name]: false,
      },
    });

    useEffect(() => {
      methods.setError(args.name, { message: "Error message" });
    }, []);

    return (
      <FormProvider {...methods}>
        <form className="p-4 max-w-sm">
          <CheckboxField {...args} />
        </form>
      </FormProvider>
    );
  },
};
