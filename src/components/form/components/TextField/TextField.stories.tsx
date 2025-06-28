import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextField } from "./TextField";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";

const meta = {
  title: "Form/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "example",
    label: "Label",
    placeholder: "Type here...",
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Wrapper to render the TextField inside FormProvider
 */
const WithForm = (args: any) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: args.defaultValue || "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form className="p-4 min-w-[200px]">
        <TextField {...args} />
      </form>
    </FormProvider>
  );
};

export const Default: Story = {
  render: WithForm,
};

export const Loading: Story = {
  render: WithForm,
  args: {
    isLoading: true,
    label: "Loading...",
  },
};

export const Number: Story = {
  render: WithForm,
  args: {
    type: "number",
    label: "Your age",
  },
};

export const WithError: Story = {
  render: (args) => {
    const methods = useForm({
      defaultValues: {
        [args.name]: "",
      },
      mode: "onSubmit",
      reValidateMode: "onSubmit",
    });
    useEffect(() => {
      methods.setError(args.name, { message: "Error message" });
    }, []);

    return (
      <FormProvider {...methods}>
        <form className="p-4 min-w-[200px]">
          <TextField {...args} />
        </form>
      </FormProvider>
    );
  },
};

// export const ArrayType: Story = {
//   render: WithForm,
//   args: {
//     type: "array",
//     defaultValue: ["apple", "banana"],
//     label: "Fruits (comma separated)",
//   },
// };
