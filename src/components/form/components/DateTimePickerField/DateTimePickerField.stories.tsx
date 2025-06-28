import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DateTimePickerField } from "./DateTimePickerField";
import { useForm, FormProvider } from "react-hook-form";
import React, { useEffect } from "react";
import dayjs from "dayjs";

const meta = {
  title: "Form/DateTimePickerField",
  component: DateTimePickerField,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "eventDate",
    label: "Event Date & Time",
    className: "w-full",
  },
} satisfies Meta<typeof DateTimePickerField>;

export default meta;
type Story = StoryObj<typeof meta>;

const WithForm = (args: any) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: args.defaultValue ?? null,
    },
  });

  return (
    <FormProvider {...methods}>
      <form className="p-4 max-w-sm space-y-4">
        <DateTimePickerField {...args} />
      </form>
    </FormProvider>
  );
};

export const Default: Story = {
  render: (args) => <WithForm {...args} />,
};

export const WithInitialDate: Story = {
  render: (args) => <WithForm {...args} />,
  args: {
    // @ts-ignore
    defaultValue: dayjs().add(1, "day").toISOString(),
  },
};

export const WithError: Story = {
  render: (args) => {
    const methods = useForm({
      defaultValues: {
        [args.name]: null,
      },
    });

    useEffect(() => {
      methods.setError(args.name, { message: "Error message" });
    }, []);

    return (
      <FormProvider {...methods}>
        <form className="p-4 w-[200px]">
          <DateTimePickerField {...args} />
        </form>
      </FormProvider>
    );
  },
};
