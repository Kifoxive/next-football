"use client";
// import { useDocumentTitle } from "@/hooks";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
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

interface IContentLayout {
  title: string;
  isLoading?: boolean;
  endContent?: (ButtonProps & {
    show?: boolean;
    text: string;
    icon: React.ReactElement;
  })[];
  children: React.ReactNode;
}

export default function ContentLayout({
  title,
  isLoading,
  endContent,
  children,
}: IContentLayout) {
  // useDocumentTitle(title);

  return (
    <Box className="relative flex flex-col items-center flex-1 overflow-auto p-4 sm:p-6">
      <Box className="sticky top-0 flex justify-center sm:justify-between w-full mb-4 sm:mb-6 z-10">
        <Box className="flex w-full md:w-fit items-center gap-2 backdrop-blur-sm bg-white/20 rounded-md px-3 py-1 z-40">
          <BackButton />
          <Typography variant="body1" fontWeight="bold" component="h1">
            {title}
          </Typography>
        </Box>
        {endContent && (
          <>
            <Box className="hidden md:flex gap-4">
              {endContent
                .filter(({ show = true }) => show)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .map(({ show, loading, ...button }, index) => (
                  <Button
                    startIcon={button.icon}
                    key={index}
                    size="small"
                    disabled={loading === true}
                    loading={loading}
                    {...button}
                  >
                    {button.text}
                  </Button>
                ))}
            </Box>
            <Box className="flex flex-col-reverse md:hidden fixed right-[20px] bottom-[20px] gap-4 z-10">
              {endContent
                .filter(({ show = true }) => show)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .map(({ show, loading, ...button }, index) => (
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
                    <Tooltip title={button.text}>
                      {loading ? <HourglassTopIcon /> : button.icon}
                    </Tooltip>
                  </Fab>
                ))}
            </Box>
          </>
        )}
      </Box>
      {/* <Container component="main">{children}</Container> */}
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
