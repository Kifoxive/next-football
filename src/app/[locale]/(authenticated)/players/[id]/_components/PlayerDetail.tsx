"use client";

import { useTranslations } from "next-intl";
import { Box, Container, Paper, Typography, Avatar } from "@mui/material";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ShieldIcon from "@mui/icons-material/Shield";
import CodeIcon from "@mui/icons-material/Code";
import { USER_ROLE } from "@/store/auth";
import { GetOneUser } from "../../types";

type PlayerDetailProps = GetOneUser["response"] & {
  canUpdate: boolean;
};

export default function PlayerDetail({
  user_name,
  first_name,
  last_name,
  role,
  avatar_url,
  bio,
}: PlayerDetailProps) {
  const t = useTranslations("players");

  return (
    <Container className="flex flex-col gap-4" disableGutters maxWidth={false}>
      {/* Header Section */}
      <Box component={Paper} className="flex items-center gap-4 p-4">
        <Avatar
          sx={{ width: 72, height: 72 }}
          alt={user_name}
          src={process.env.NEXT_PUBLIC_PROFIlS_BUCKET_URL! + avatar_url}
        />
        <Box>
          <Typography variant="h5">
            {first_name} {last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{user_name}
          </Typography>
          <Box className="flex items-center gap-2 mt-1">
            {role === USER_ROLE.player && (
              <Box className="flex items-center gap-1 text-gray-600">
                <SportsSoccerIcon fontSize="small" color="inherit" />{" "}
                {t("role.player")}
              </Box>
            )}
            {role === USER_ROLE.moderator && (
              <Box className="flex items-center gap-1 text-gray-600">
                <ShieldIcon fontSize="small" color="warning" />{" "}
                {t("role.moderator")}
              </Box>
            )}
            {role === USER_ROLE.admin && (
              <Box className="flex items-center gap-1 text-gray-600">
                <CodeIcon fontSize="small" color="info" /> {t("role.admin")}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Contact Section */}
      {/* <Box component={Paper} className="p-4">
          <Typography variant="subtitle1">{t("contactInfo")}</Typography>
          <Divider className="my-2" />
          <Typography>Email: {email}</Typography>
        </Box> */}

      {/* Bio Section */}
      {bio && (
        <Box component={Paper} className="p-4">
          <Typography variant="subtitle1" className="mb-2">
            {t("detail.bio")}
          </Typography>
          <MarkdownViewer content={bio} />
        </Box>
      )}
    </Container>
  );
}
