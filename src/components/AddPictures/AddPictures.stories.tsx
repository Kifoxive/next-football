import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddPictures, IPictureItem } from "./AddPictures";

import { useState } from "react";

const meta = {
  title: "Components/AddPictures",
  component: AddPictures,
  parameters: {
    layout: "center",
  },
} satisfies Meta<typeof AddPictures>;

export default meta;

type Story = StoryObj<typeof meta>;

const WithState = () => {
  // pictures state to manipulate then locally
  const [pictures, setPictures] = useState<IPictureItem[]>([
    {
      url: "https://prazacka.cz/data/image/file/prazacka-vtk-8927.jpg",
      file: null,
    },
    {
      url: "https://prazacka.cz/data/image/file/prazacka-vtk-8921.jpg",
      file: null,
    },
  ]);

  const handleAddPicture = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPictures((prev) => [...prev, { file, url: objectUrl }]);
  };

  const handleRemovePicture = (index: number) => {
    setPictures((prev) => {
      const newArr = [...prev];
      const removed = newArr.splice(index, 1)[0];

      if (removed.file) {
        // if this is a local object URL — free the memory
        URL.revokeObjectURL(removed.url);
      }

      return newArr;
    });
  };

  return (
    <div className="p-4">
      <AddPictures
        locationName={"Stadium"}
        pictures={pictures}
        onAddPicture={handleAddPicture}
        onRemovePicture={handleRemovePicture}
        onReorderPictures={setPictures}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <WithState />,
  args: {
    locationName: "Stadium",
    pictures: [
      {
        url: "https://prazacka.cz/data/image/file/prazacka-vtk-8927.jpg",
        file: null,
      },
      {
        url: "https://prazacka.cz/data/image/file/prazacka-vtk-8921.jpg",
        file: null,
      },
    ],
    onAddPicture: () => {},
    onRemovePicture: () => {},
    onReorderPictures: () => {},
  },
};
