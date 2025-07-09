"use client";

import Navbar from "@/components/Navbar";
import { Box } from "@mui/material";

export const AnonymousLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box className="flex flex-col h-screen">
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 20, // to be above other content
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : theme.palette.background.paper,
        }}
      >
        <Navbar anonymous />
      </Box>
      <Box className="flex grow" component="main">
        {children}
      </Box>
    </Box>
  );
};
