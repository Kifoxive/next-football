"use client";

import {
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Fab,
  Tooltip,
  Typography,
} from "@mui/material";
import { BackButton } from "../BackButton";
import { useTheme } from "next-themes";
import Link from "next/link";

interface IContentLayout {
  title: string;
  isLoading?: boolean;
  endContent?: (Pick<
    ButtonProps,
    "type" | "form" | "variant" | "color" | "loading"
  > & {
    show?: boolean;
    text: string;
    icon: React.ReactElement;
    // for server pages
    redirect?: string;
    // for client pages
    onClick?: () => void;
  })[];
  children: React.ReactNode;
}

export default function ContentLayout({
  title,
  isLoading,
  endContent,
  children,
}: IContentLayout) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Box className="relative flex flex-col items-center flex-1 overflow-auto p-4 sm:p-6">
      <Box className="sticky top-0 flex justify-center sm:justify-between w-full mb-4 sm:mb-6 z-10">
        <Box className="flex w-full md:w-fit items-center gap-2 backdrop-blur-sm bg-white/20 rounded-sm px-3 py-1 z-40">
          <BackButton />
          <Typography variant="body1" fontWeight="bold" component="h1">
            {title}
          </Typography>
        </Box>
        {endContent && (
          <>
            {/* Desktop buttons */}
            <Box className="hidden md:flex gap-4">
              {endContent
                .filter(({ show = true }) => show)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .map(({ show, loading, icon, text, ...button }, index) => (
                  <Button
                    {...button}
                    startIcon={icon}
                    key={index}
                    size="small"
                    disabled={loading === true}
                    loading={loading}
                  >
                    {text}
                  </Button>
                ))}
            </Box>
            {/* Mobile buttons */}
            <Box className="flex flex-col-reverse md:hidden fixed right-[20px] bottom-[20px] gap-4 z-10">
              {endContent
                .filter(({ show = true }) => show)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .map(({ show, loading, icon, redirect, ...button }, index) =>
                  redirect ? (
                    <Link href={redirect} key={index}>
                      <Fab
                        aria-label={button.text}
                        color={button.color}
                        size="small"
                        disabled={loading == true}
                        {...button}
                        variant="circular"
                        sx={{ color: isDark ? "#222222" : "#ffffff" }}
                      >
                        <Tooltip title={button.text} className="font-black">
                          {icon}
                        </Tooltip>
                      </Fab>
                    </Link>
                  ) : (
                    <Fab
                      onClick={button.onClick}
                      aria-label={button.text}
                      color={button.color}
                      key={index}
                      size="small"
                      disabled={loading == true}
                      {...button}
                      variant="circular"
                      sx={{ color: isDark ? "#222222" : "#ffffff" }}
                    >
                      <Tooltip title={button.text} className="font-black">
                        {icon}
                      </Tooltip>
                    </Fab>
                  )
                )}
            </Box>
          </>
        )}
      </Box>
      <Box component="main" className="w-full flex-1 pb-18">
        {isLoading ? (
          <Box className="flex justify-center items-center h-full pb-20">
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}
