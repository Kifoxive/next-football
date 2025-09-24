"use client";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import {
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Typography,
} from "@mui/material";
import { BackButton } from "../BackButton";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

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
            {/* Mobile SpeedDial */}
            <Box className="flex md:hidden fixed right-[20px] bottom-[20px] z-10">
              <SpeedDial
                ariaLabel="actions"
                icon={<SpeedDialIcon />}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                // sx={{ position: "absolute", bottom: 0, right: 0 }}
              >
                {endContent
                  .filter(({ show = true }) => show)
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  .map(({ show, loading, icon, text, ...button }, index) => (
                    <SpeedDialAction
                      {...button}
                      key={index}
                      icon={
                        loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          icon
                        )
                      }
                      slotProps={{
                        tooltip: {
                          title: text,
                        },
                      }}
                      sx={{
                        opacity: loading ? 0.5 : 1,
                        pointerEvents: loading ? "none" : "auto",
                      }}
                    />
                  ))}
              </SpeedDial>
            </Box>
          </>
        )}
      </Box>
      <Box component="main" className="w-full flex-1">
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
