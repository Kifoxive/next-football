import { Box, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";
import { de, cs, uk } from "date-fns/locale";
import { useLocale } from "next-intl";

type DateSeparatorProps = {
  date: Date;
};

export const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const theme = useTheme();
  const locale = useLocale();

  const localeMap = {
    en: undefined,
    de,
    cs,
    uk,
  };

  const dateLocale = localeMap[locale as keyof typeof localeMap];
  const formattedDate = format(date, "d.M.yyyy", { locale: dateLocale });
  return (
    <Box className={"flex justify-center py-3 sticky top-0 z-20"}>
      <Typography
        variant="caption"
        sx={{
          px: 2,
          py: 0.5,
          borderRadius: "12px",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(60, 60, 60, 0.8)"
              : "rgba(200, 200, 200, 0.5)",
          color: theme.palette.text.secondary,
          fontWeight: 500,
        }}
      >
        {formattedDate}
      </Typography>
    </Box>
  );
};
