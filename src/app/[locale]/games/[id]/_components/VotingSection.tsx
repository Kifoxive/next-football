import { VOTE_OPTION } from "@/config";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslations } from "next-intl";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { clsx } from "yet-another-react-lightbox";
import { getThemedColor } from "@/utils/getThemedColor";

const colorMap: Record<VOTE_OPTION, string> = {
  yes: "bg-green-500",
  no: "bg-red-500",
  maybe: "bg-yellow-400",
};

export const voteOptions = [
  {
    option: VOTE_OPTION["yes"],
    icon: <CheckCircleOutlineIcon color="success" fontSize="small" />,
  },
  {
    option: VOTE_OPTION["no"],
    icon: <CancelOutlinedIcon color="error" fontSize="small" />,
  },
  {
    option: VOTE_OPTION["maybe"],
    icon: <HelpOutlineOutlinedIcon color="warning" fontSize="small" />,
  },
];

type VotingSectionProps = {
  myVote?: VOTE_OPTION;
  minYesVotesCount: number;
  total: number;
  results: { yes: number; no: number; maybe: number };
  isVoteLoading: boolean;
  onVoteChange: (status: VOTE_OPTION) => void;
};

export const VotingSection: React.FC<VotingSectionProps> = ({
  myVote,
  total,
  minYesVotesCount,
  results,
  isVoteLoading,
  onVoteChange,
}) => {
  const t = useTranslations("games.voting");
  const theme = useTheme();
  const iconBg = { color: getThemedColor(theme) };

  // const yesPercentage = total > 0 ? (results.yes / total) * 100 : 0;
  // const noPercentage = total > 0 ? (results.no / total) * 100 : 0;
  // const maybePercentage = total > 0 ? (results.maybe / total) * 100 : 0;
  const resultsArray = [
    { option: VOTE_OPTION["yes"], count: results.yes },
    { option: VOTE_OPTION["no"], count: results.no },
    { option: VOTE_OPTION["maybe"], count: results.maybe },
  ];

  return (
    <Box
      className="flex flex-col gap-4 p-4 border-l-4 border-blue-500"
      component={Paper}
    >
      <Typography variant="body1">{t("alert.title")}</Typography>
      {/* {myVote ? (
        <Box>
          <Typography variant="body2">
            {t("myVoteResult", { vote: t(myVote) })}
          </Typography>
        </Box>
      ) : ( */}
      <Box className="flex items-center gap-2">
        {voteOptions.map(({ option, icon }) => (
          <Button
            key={option}
            onClick={() => (myVote === option ? null : onVoteChange(option))}
            sx={{
              bgcolor: myVote === option ? "action.selected" : "transparent",
            }}
            className="flex items-center gap-2"
            // loading={isVoteLoading}
            disabled={isVoteLoading}
          >
            {icon}
            <Typography variant="caption">{t(option)}</Typography>
          </Button>
        ))}
        {isVoteLoading && <CircularProgress size={24} />}
      </Box>
      {/* )} */}
      <Divider />
      <Box className="flex items-center gap-1">
        <Typography sx={{ marginRight: 1 }}>{t("result")}:</Typography>
        <Typography
          color={results.yes >= minYesVotesCount ? "success" : "error"}
        >
          {results.yes}
        </Typography>
        / {minYesVotesCount}
        <PersonIcon fontSize="small" sx={iconBg} />
      </Box>
      <Box className="flex flex-col gap-2">
        {resultsArray.map(({ option, count }) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <Box key={option}>
              <Typography>{t(option)}</Typography>
              <Box className="flex w-full items-center -my-1">
                <div
                  className={clsx(
                    "relative w-[300px] h-2 rounded overflow-hidden",
                    theme.palette.mode === "light"
                      ? "bg-gray-200"
                      : "bg-gray-800"
                  )}
                >
                  <div
                    className={clsx(
                      "absolute left-0 top-0 h-full transition-all duration-300 rounded",
                      colorMap[option]
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <Box className="flex items-center gap-1">
                  <Typography className="w-[25px] text-end">{count}</Typography>
                  <PersonIcon fontSize="small" sx={iconBg} />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
