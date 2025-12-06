import { VOTE_OPTION } from "@/config";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

type VotingAlertProps = {
  onVoteChange: (status: VOTE_OPTION) => void;
};

export const VotingAlert: React.FC<VotingAlertProps> = ({ onVoteChange }) => {
  const t = useTranslations("games.voting");

  return (
    <Box
      className="absolute top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 m-4 px-6 p-4 border-l-4 border-blue-500 z-30"
      component={Paper}
    >
      <Typography variant="body1">{t("alert.title")}</Typography>
      <Box className="flex justify-between gap-2 mt-2">
        <Button
          onClick={() => onVoteChange(VOTE_OPTION.yes)}
          className="flex items-center gap-2"
        >
          <CheckCircleOutlineIcon color="success" />
          <Typography variant="caption">{t("yes")}</Typography>
        </Button>
        <Button
          onClick={() => onVoteChange(VOTE_OPTION.no)}
          className="flex items-center gap-2"
        >
          <CancelOutlinedIcon color="error" />
          <Typography variant="caption">{t("no")}</Typography>
        </Button>
        <Button
          onClick={() => onVoteChange(VOTE_OPTION.maybe)}
          className="flex items-center gap-2"
        >
          <HelpOutlineOutlinedIcon color="warning" />
          <Typography variant="caption">{t("maybe")}</Typography>
        </Button>
      </Box>
    </Box>
  );
};
