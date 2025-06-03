"use client";

import { Box, Typography } from "@mui/material";
import ContentLayout from "@/components/ContentLayout";
import { useTranslations } from "next-intl";
import { LoginButton } from "../../../components/LoginButton";

export default function LoginPage() {
  const t = useTranslations("login");

  return (
    <ContentLayout>
      <Box className="bg-black px-8 py-4 border-2 rounded-lg w-[400px]">
        <Typography variant="h5" mb={6}>
          {t("title")}
        </Typography>
        <LoginButton />
        {/* <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleLogin} fullWidth>
          Log In
        </Button> */}
      </Box>
    </ContentLayout>
  );
}
