import type { Meta, StoryObj } from "@storybook/react";
import { MarkdownEditor } from "./MarkdownEditor";
import { FormProvider, useForm } from "react-hook-form";

const meta = {
  title: "Form/MarkdownEditor",
  component: MarkdownEditor,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MarkdownEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Wrapper to render the MarkdownEditor inside FormProvider
 */
const WithForm = (args: any) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: args.defaultValue || "**Description**",
    },
  });

  return (
    <FormProvider {...methods}>
      <form className="p-4">
        <MarkdownEditor {...args} />
      </form>
    </FormProvider>
  );
};

export const Default: Story = {
  render: WithForm,
  args: {
    name: "description",
    label: "Description",
  },
};
