"use client";

import { useTranslations } from "next-intl";
import {
  Container,
  Paper,
  Stack,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type SectionKey =
  | "introduction"
  | "scope"
  | "dataCollection"
  | "dataStorage"
  | "dataUsage"
  | "security"
  | "userRights"
  | "changes"
  | "contact";

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacyPolicy");

  const sections: SectionKey[] = [
    "introduction",
    "scope",
    "dataCollection",
    "dataStorage",
    "dataUsage",
    "security",
    "userRights",
    "changes",
    "contact",
  ];

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="md" sx={{ marginX: "auto", paddingBottom: 6 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mt: 2,
                mb: 1,
                fontWeight: 600,
              }}
            >
              {t("title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("lastUpdated")}
            </Typography>
          </Box>

          {/* Policy Sections as Accordions */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={0}>
              {sections.map((sectionKey) => (
                <Accordion
                  key={sectionKey}
                  defaultExpanded={sectionKey === "introduction"}
                  sx={{
                    "&:first-of-type": {
                      borderTopLeftRadius: "inherit",
                      borderTopRightRadius: "inherit",
                    },
                    "&:last-of-type": {
                      borderBottomLeftRadius: "inherit",
                      borderBottomRightRadius: "inherit",
                    },
                    "&:not(:last-child)": {
                      borderBottom: "1px solid",
                      borderBottomColor: "divider",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {t(`sections.${sectionKey}.title`)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      pt: 0,
                      pb: 2,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.7,
                        color: "text.secondary",
                      }}
                    >
                      {t(`sections.${sectionKey}.content`)}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
