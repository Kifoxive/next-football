"use client";

import { useRouter } from "next/navigation";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <IconButton aria-label="back" size="small" onClick={handleBack}>
      <ArrowBackIcon fontSize="small" />
    </IconButton>
  );
};
