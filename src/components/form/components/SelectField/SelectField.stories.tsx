import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SelectField } from "./SelectField";
import { useForm, FormProvider } from "react-hook-form";
import React, { useEffect } from "react";
import type { OptionType } from "@/utils/types";
import { GAME_STATUS } from "@/config";
import { GameStatusChip } from "@/components/GameStatusChip";

const options: OptionType[] = [
  { label: "Red", value: "red" },
  { label: "Green", value: "green" },
  { label: "Blue", value: "blue" },
];

const meta = {
  title: "Form/SelectField",
  component: SelectField,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "color",
    label: "Choose a color",
    options,
    fullWidth: true,
  },
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

const WithForm = (args: any) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: args.defaultValue ?? "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form className="p-4 min-w-[200px]">
        <SelectField {...args} />
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
    defaultValue: "green",
  },
};

export const WithIcons: Story = {
  render: (args) => {
    const gameStatusOptions = Object.values(GAME_STATUS).map((value) => ({
      label: <GameStatusChip value={value} />,
      value,
    }));

    return <WithForm {...args} options={gameStatusOptions} />;
  },
  args: {
    defaultValue: "initialization",
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
      methods.setError(args.name, {
        type: "manual",
        message: "Please select a color",
      });
    }, [args.name, methods]);

    return (
      <FormProvider {...methods}>
        <form className="p-4 min-w-[220px]">
          <SelectField {...args} />
        </form>
      </FormProvider>
    );
  },
};
