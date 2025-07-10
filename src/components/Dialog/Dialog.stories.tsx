import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import Dialog from "./Dialog";

const meta = {
  title: "Feedback/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

import type { ComponentProps } from "react";

const Template = (args: ComponentProps<typeof Dialog>) => {
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      {...args}
      isOpen={open}
      setIsOpen={setOpen}
      onAgree={() => {
        alert("Agreed");
        setOpen(false);
      }}
      onCancel={() => {
        alert("Cancelled");
        setOpen(false);
      }}
    />
  );
};

export const Default: Story = {
  args: {
    title: "Delete Game?",
    description:
      "Are you sure you want to delete this game? This action cannot be undone.",
    agreeBtnText: "Delete",
    cancelBtnText: "Cancel",
    isOpen: true,
    setIsOpen: () => {},
    onAgree: () => {},
    onCancel: () => {},
  },
  render: (args) => <Template {...args} />,
};
