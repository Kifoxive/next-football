import { Theme } from "@mui/material";

export const getThemedColor = (theme: Theme) =>
  theme.palette.mode === "light" ? "#777" : "#fff";
