import type { Meta, StoryObj } from "@storybook/react";
import ContentLayout from "./ContentLayout";
import { Box, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

// 👇 Let's change useDocumentTitle to avoid errors in Storybook
// jest.mock("@/hooks", () => ({
//   useDocumentTitle: () => {},
// }));

const meta = {
  title: "Layout/ContentLayout",
  component: ContentLayout,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ContentLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "My Page",
    children: (
      <Box>
        <Typography variant="body1">
          This is where the page content will be. The content of the
          `ContentLayout` component.
        </Typography>
      </Box>
    ),
  },
};

export const WithButtons: Story = {
  args: {
    title: "Page with actions",
    endContent: [
      {
        text: "Save",
        icon: <SaveIcon />,
        onClick: () => alert("Saved"),
        color: "primary",
      },
      {
        text: "Add",
        icon: <AddIcon />,
        onClick: () => alert("Added"),
        color: "secondary",
      },
    ],
    children: (
      <Typography>
        This is an example of a component with `endContent` buttons.
      </Typography>
    ),
  },
};

export const Loading: Story = {
  args: {
    title: "Loading...",
    isLoading: true,
  },
};
