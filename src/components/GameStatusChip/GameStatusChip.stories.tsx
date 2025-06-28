import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GameStatusChip } from "./GameStatusChip";
import { GAME_STATUS } from "@/config";

const meta = {
  title: "Display/GameStatusChip",
  component: GameStatusChip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "select",
      options: Object.values(GAME_STATUS),
    },
  },
} satisfies Meta<typeof GameStatusChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initialization: Story = {
  args: {
    value: GAME_STATUS.initialization,
  },
};

export const Voting: Story = {
  args: {
    value: GAME_STATUS.voting,
  },
};

export const Confirmed: Story = {
  args: {
    value: GAME_STATUS.confirmed,
  },
};

export const Completed: Story = {
  args: {
    value: GAME_STATUS.completed,
  },
};

export const Cancelled: Story = {
  args: {
    value: GAME_STATUS.cancelled,
  },
};
