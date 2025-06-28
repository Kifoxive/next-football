import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UserRoleChip } from "./UserRoleChip";
import { USER_ROLE } from "@/store/auth";

const meta = {
  title: "Display/UserRoleChip",
  component: UserRoleChip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "select",
      options: Object.values(USER_ROLE),
    },
  },
} satisfies Meta<typeof UserRoleChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Admin: Story = {
  args: {
    value: USER_ROLE.admin,
  },
};

export const Moderator: Story = {
  args: {
    value: USER_ROLE.moderator,
  },
};

export const Player: Story = {
  args: {
    value: USER_ROLE.player,
  },
};
