import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import Dialog from "./Dialog"; // ← імпортуй свій компонент сюди

const meta = {
  title: "Feedback/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: any) => {
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
  render: (args) => <Template {...args} />,
  // @ts-ignore
  args: {
    title: "Delete Game?",
    description:
      "Are you sure you want to delete this game? This action cannot be undone.",
    agreeBtnText: "Delete",
    cancelBtnText: "Cancel",
  },
};
