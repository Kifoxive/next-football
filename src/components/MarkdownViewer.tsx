"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@mui/material";
import SimpleMarkdown from "markdown-to-jsx";

const Markdown = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

type Props = {
  content: string;
};

export const MarkdownViewer: React.FC<Props> = ({ content }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isDark = mode === "dark";


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

  return isModernBrowser ? (
    <div data-color-mode={mode}>
      <Markdown source={content} />
    </div>
  ) : (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <SimpleMarkdown
        options={{
          overrides: {
            h1: {
              props: { className: "text-3xl font-bold border-b pb-2 mb-2" },
            },
            h2: { props: { className: "text-2xl font-semibold mt-6 mb-2" } },
            h3: { props: { className: "text-xl font-semibold mt-4 mb-2" } },
            p: { props: { className: "mb-4 leading-relaxed" } },
            blockQuote: {
              props: {
                className:
                  "border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md",
              },
            },
            hr: {
              props: { className: "my-6 border-gray-300 dark:border-gray-700" },
            },
            table: {
              props: {
                className:
                  "table-auto border-collapse w-full text-left text-sm my-4",
              },
            },
            th: {
              props: {
                className: [
                  "px-3 py-2 border font-semibold",
                  isDark
                    ? "bg-gray-800 text-gray-200 border-gray-600"
                    : "bg-gray-100 text-gray-800 border-gray-300",
                ].join(" "),
              },
            },
            td: {
              props: {
                className: [
                  "px-3 py-2 border",
                  isDark
                    ? "text-gray-300 border-gray-600"
                    : "text-gray-700 border-gray-300",
                ].join(" "),
              },
            },
          },
        }}
      >
        {content}
      </SimpleMarkdown>
    </div>
  );
};
