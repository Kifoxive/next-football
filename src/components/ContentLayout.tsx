"use client";
import { useDocumentTitle } from "@/hooks";
import { Box, Typography } from "@mui/material";

interface IContentLayout {
  children: React.ReactNode;
  title: string;
  endContent?: React.ReactNode;
}

export default function ContentLayout({
  title,
  children,
  endContent,
}: IContentLayout) {
  useDocumentTitle(title);
  return (
    <Box className="flex flex-col items-center full-width full-height flex-1 overflow-auto p-[16px] sm:p-[24px]">
      <Box className="flex justify-center sm:justify-between w-full bg-gray-400 mb-4 sm:mb-10">
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        {endContent && <Box className="flex gap-4">{endContent}</Box>}
      </Box>
      {/* <Container component="main">{children}</Container> */}
      <Box component="main" className="w-full">
        {children}
      </Box>
    </Box>
  );
}
