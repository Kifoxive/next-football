"use client";
import { useDocumentTitle } from "@/hooks";
import {
  Box,
  Button,
  ButtonProps,
  Fab,
  Tooltip,
  Typography,
} from "@mui/material";

interface IContentLayout {
  children: React.ReactNode;
  title: string;
  endContent?: (ButtonProps & {
    show?: boolean;
    text: string;
    icon: React.ReactElement;
  })[];
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
        {endContent && (
          <>
            <Box className="hidden md:flex gap-4">
              {endContent
                .filter(({ show = true }) => show)
                .map((button, index) => (
                  <Button
                    startIcon={button.icon}
                    key={index}
                    size="small"
                    disabled={button.loading == true}
                    {...button}
                  >
                    {button.text}
                  </Button>
                ))}
            </Box>
            <Box className="flex md:hidden fixed right-[20px] bottom-[20px] gap-4 z-10">
              {endContent
                .filter(({ show = true }) => show)
                .map(({ loading, ...button }, index) => (
                  <Fab
                    onClick={button.onClick}
                    aria-label={button.text}
                    color={button.color}
                    key={index}
                    size="medium"
                    disabled={loading == true}
                    {...button}
                    variant="circular"
                  >
                    <Tooltip title={button.text}>{button.icon}</Tooltip>
                  </Fab>
                ))}
            </Box>
          </>
        )}
      </Box>
      {/* <Container component="main">{children}</Container> */}
      <Box component="main" className="w-full">
        {children}
      </Box>
    </Box>
  );
}
