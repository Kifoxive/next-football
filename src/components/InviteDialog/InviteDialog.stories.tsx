import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import Dialog from "./InviteDialog";

const meta = {
  title: "Feedback/InviteDialog",
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
      userId="7e3c842b-6fe3-4050-9111-c465575f89ec"
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
};
