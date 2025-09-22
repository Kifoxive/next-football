import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { IMessage } from "../types";
import { format } from "date-fns";
import { USER_ROLE } from "@/store/auth";

type MessageProps = {
  isMineMessage: boolean;
  data: IMessage;
};

export const Message: React.FC<MessageProps> = ({ isMineMessage, data }) => {
  const theme = useTheme();
  const isLightTheme = theme.palette.mode === "light";

  const messageStyle = {
    mineMessage: {
      light: "bg-blue-300",
      dark: "bg-blue-500",
    },
    default: { light: "bg-gray-200", dark: "bg-gray-800" },
  };

  const selectedStyle =
    messageStyle[isMineMessage ? "mineMessage" : "default"][theme.palette.mode];

  return (
    <Box
      className={`flex max-w-[80%] sm:max-w-[60%] gap-2 ${isMineMessage && "self-end"}`}
    >
      {!isMineMessage && (
        <Avatar
          alt={data.profiles.user_name}
          src={
            process.env.NEXT_PUBLIC_PROFIlS_BUCKET_URL! +
            data.profiles.avatar_url
          }
          sx={{ width: 34, height: 34 }}
        />
      )}
      <Box
        className={`relative flex flex-col px-3 p-2 w-fit rounded-b-2xl shadow-sm ${selectedStyle} ${isMineMessage ? "rounded-tl-2xl" : "rounded-tr-2xl"}
        ${!isMineMessage && data.profiles.role === USER_ROLE["moderator"] && `border-l-2 ${isLightTheme ? "border-l-neutral-400" : "border-l-neutral-500"}`}
        `}
      >
        {!isMineMessage && (
          <Typography
            color="info"
            fontSize={13}
            sx={{ position: "relative", top: "-4px" }}
          >
            {data.profiles?.user_name}
          </Typography>
        )}
        {data.type === "text" && (
          <Typography fontSize={14} lineHeight={1.2}>
            {data?.text}
            <span className="w-[40px] inline-block" />
          </Typography>
        )}
        <Typography
          variant="caption"
          color={
            isMineMessage ? (isLightTheme ? "#2C2D2D" : "#C2C2C2") : "gray"
          }
          sx={{ position: "absolute", right: "8px", bottom: "2px" }}
        >
          {format(data.created_at, "hh:mm")}
        </Typography>
      </Box>
    </Box>
  );
};
