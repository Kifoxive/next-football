import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { vi } from "vitest";

// --- MOCK: Next.js navigation ---
import * as nextNavigation from "next/navigation";

const pushMock = vi.fn();
const useRouterMock = () => ({ push: pushMock });
const usePathnameMock = () => "/en/some-page";

vi.mock("next/navigation", async () => {
  const actual =
    await vi.importActual<typeof nextNavigation>("next/navigation");
  return {
    ...actual,
    useRouter: useRouterMock,
    usePathname: usePathnameMock,
  };
});
// -------------------------------

const meta = {
  title: "Navigation/LocaleSwitcher",
  component: LocaleSwitcher,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LocaleSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
