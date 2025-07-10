import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import InviteDialog from "./InviteDialog";

const meta = {
  title: "Feedback/InviteDialog",
  component: InviteDialog,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof InviteDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = () => {
  const [open, setOpen] = useState(true);

  return (
    <InviteDialog
      inviterId="1e3c842b-6fe3-4050-9111-c465575f89ec"
      userId="7e3c842b-6fe3-4050-9111-c465575f89ec"
      isOpen={open}
      setIsOpen={setOpen}
      onCancel={() => {
        alert("Cancelled");
        setOpen(false);
      }}
    />
  );
};

export const Default: Story = {
  render: () => <Template />,
  args: {
    inviterId: "1e3c842b-6fe3-4050-9111-c465575f89ec",
    userId: "7e3c842b-6fe3-4050-9111-c465575f89ec",
    isOpen: true,
    setIsOpen: () => {},
    onCancel: () => {},
  },
};
