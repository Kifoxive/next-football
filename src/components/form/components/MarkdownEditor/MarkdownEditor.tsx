"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Controller } from "react-hook-form";
import { BaseFieldProps } from "../../types";
import {
  Box,
  FormHelperText,
  Typography,
  useTheme,
  TextareaAutosize,
} from "@mui/material";

const Markdown = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type MarkdownEditorProps = BaseFieldProps & {};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  name,
  label,
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // Detect old Safari <=16
  const isModernBrowser = (() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    // Check for Safari (ignore Chrome/iOS Chrome, etc.)
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua)
    if (!isSafari) return true; // Non-Safari browsers are modern
    // Extract Safari version
    const match = ua.match(/Version\/(\d+)\./);
    if (match && match[1]) {
      const version = parseInt(match[1], 10);
      return version > 16; // Only modern Safari >=16
    }

    return false; // fallback: old Safari
  })();

  return (
    <Controller
      name={name}
      render={({ field: { value = "", onChange }, fieldState: { error } }) => (
        <Box data-color-mode={mode} className="mb-1">
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            {label}
          </Typography>
          {isModernBrowser ? (
            <Markdown
              height={400}
              value={value || ""}
              onChange={(val = "") => onChange(val)}
              previewOptions={{
                // optional: can pass the same dark/light styling fixes here
                rehypePlugins: [],
              }}
            />
          ) : (
            // Fallback for old Safari: simple textarea
            <TextareaAutosize
              minRows={20}
              style={{
                width: "100%",
                padding: 8,
                fontFamily: "inherit",
                fontSize: 16,
                borderRadius: 4,
                border: "1px solid #ccc",
                backgroundColor: mode === "dark" ? "#1f2937" : "#fff",
                color: mode === "dark" ? "#e5e7eb" : "#111827",
              }}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            />
          )}

          {error && (
            <FormHelperText error sx={{ marginTop: "6px" }}>
              {error.message}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
};
