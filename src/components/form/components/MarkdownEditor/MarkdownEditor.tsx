"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Controller } from "react-hook-form";
import { BaseFieldProps } from "../../types";
import { Box, FormHelperText, Typography, useTheme } from "@mui/material";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type MarkdownEditorProps = BaseFieldProps & {};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  name,
  label,
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Controller
      name={name}
      render={({ field: { value = "", onChange }, fieldState: { error } }) => {
        return (
          <Box data-color-mode={mode} className="mb-1">
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              {label}
            </Typography>
            <MDEditor
              height={400}
              value={value || ""}
              onChange={(val = "") => onChange(val)}
            />
            {error && (
              <FormHelperText error sx={{ marginTop: "6px" }}>
                {error.message}
              </FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
};
