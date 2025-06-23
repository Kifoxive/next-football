"use client";

import dynamic from "next/dynamic";
import "@uiw/react-markdown-preview/markdown.css";
import { useTheme } from "@mui/material";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

type Props = {
  content: string;
};

export const MarkdownViewer: React.FC<Props> = ({ content }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <div data-color-mode={mode}>
      <MarkdownPreview source={content} />
    </div>
  );
};
