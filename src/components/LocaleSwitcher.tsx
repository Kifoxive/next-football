"use client";

import { useRouter, usePathname } from "next/navigation";
import { MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useTransition } from "react";

const locales = [
  { code: "en", label: "English" },
  { code: "uk", label: "Українська" },
  { code: "cz", label: "Čeština" },
];

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value;

    // Змінюємо /cz/some-page → /uk/some-page
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
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
  );
}
