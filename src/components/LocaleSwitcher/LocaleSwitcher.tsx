"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import TranslateIcon from "@mui/icons-material/Translate";

const locales = [
  { code: "en", label: "English" },
  { code: "uk", label: "Українська" },
  { code: "cz", label: "Čeština" },
];

export const LocaleSwitcher = () => {
  const t = useTranslations("basic");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value;

    // Change /cz/some-page → /uk/some-page
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <Box className="flex items-center gap-2">
      <TranslateIcon fontSize="small" />
      <Typography variant="body1">{t("interfaceLanguage")}</Typography>
      <Select
        value={currentLocale}
        onChange={handleChange}
        size="small"
        sx={{ ml: 2, color: "white", borderColor: "white" }}
        variant="outlined"
      >
        {locales.map(({ code, label }) => (
          <MenuItem key={code} value={code}>
            <Typography>{label}</Typography>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
