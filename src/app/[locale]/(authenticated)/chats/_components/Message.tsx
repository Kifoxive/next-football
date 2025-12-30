import {
  Avatar,
  Box,
  Typography,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import { IMessage } from "../types";
import { format } from "date-fns";
import { USER_ROLE } from "@/store/auth";
import { Link } from "@/i18n/navigation";
import { config } from "@/config";
import { useState } from "react";
import { useTranslations } from "next-intl";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type MessageProps = {
  isMineMessage: boolean;
  data: IMessage;
  isLoading?: boolean;
  isPreviousMessageTheSamePerson: boolean;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, text: string) => void;
};

export const Message: React.FC<MessageProps> = ({
  isMineMessage,
  data,
  isLoading = false,
  isPreviousMessageTheSamePerson,
  onDelete,
  onEdit,
}) => {
  const theme = useTheme();
  const t = useTranslations();
  const isLightTheme = theme.palette.mode === "light";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(data.text || "");

  const messageStyle = {
    mineMessage: {
      light: "bg-blue-300",
      dark: "bg-blue-500",
    },
    default: { light: "bg-gray-200", dark: "bg-gray-800" },
  };

  const selectedStyle =
    messageStyle[isMineMessage ? "mineMessage" : "default"][theme.palette.mode];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(data.id);
    handleMenuClose();
  };

  const handleEditStart = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleEditSave = () => {
    onEdit(data.id, editedText);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditedText(data.text || "");
    setIsEditing(false);
  };

  return (
    <Box
      className={`flex max-w-[80%] sm:max-w-[60%] gap-2 group ${
        isMineMessage && "self-end"
      } ${isPreviousMessageTheSamePerson && "-mt-2"}`}
    >
      {!isMineMessage && !isPreviousMessageTheSamePerson ? (
        <Link
          href={config.routes.players.detail.replace(":id", data.sender_id)}
        >
          <Avatar
            alt={data.profiles.user_name}
            src={
              process.env.NEXT_PUBLIC_PROFIlS_BUCKET_URL! +
              data.profiles.avatar_url
            }
            sx={{ width: 34, height: 34 }}
          />
        </Link>
      ) : (
        <div className="ml-[33px]" />
      )}
      <Box className="relative" onContextMenu={handleMenuClick}>
        <Box
          className={`relative flex flex-col px-3 p-2 w-fit rounded-b-2xl shadow-sm ${selectedStyle} ${
            isMineMessage ? "rounded-tl-2xl" : "rounded-tr-2xl"
          }
          ${
            !isMineMessage &&
            data.profiles.role === USER_ROLE["moderator"] &&
            `border-l-2 ${
              isLightTheme ? "border-l-neutral-400" : "border-l-neutral-500"
            }`
          }
          ${isPreviousMessageTheSamePerson && "rounded-t-2xl"}
          `}
        >
          {!isMineMessage && !isPreviousMessageTheSamePerson && (
            <Typography
              color="info"
              fontSize={13}
              sx={{ position: "relative", top: "-4px" }}
            >
              {data.profiles?.user_name}
            </Typography>
          )}
          {isEditing ? (
            <Box className="flex flex-col gap-2">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="px-2 py-1 rounded text-sm bg-opacity-50"
                style={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#333" : "#fff",
                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                  border: `1px solid ${theme.palette.divider}`,
                  resize: "none",
                }}
                disabled={isLoading}
              />
              <Box className="flex gap-1 text-xs">
                <button
                  onClick={handleEditSave}
                  disabled={isLoading}
                  className="px-2 bg-gray-700 cursor-pointer text-white rounded hover:opacity-80 disabled:opacity-50"
                >
                  {t("chats.messages.save")}
                </button>
                <button
                  onClick={handleEditCancel}
                  disabled={isLoading}
                  className="px-2 border-2 bg-gray-600 border-gray-700 cursor-pointer text-white rounded hover:opacity-80 disabled:opacity-50"
                >
                  {t("chats.messages.cancel")}
                </button>
              </Box>
            </Box>
          ) : (
            <>
              {data.type === "text" && (
                <Typography fontSize={14} lineHeight={1.2}>
                  {data?.text}
                  <span className="w-[40px] inline-block" />
                </Typography>
              )}
              <Typography
                variant="caption"
                color={
                  isMineMessage
                    ? isLightTheme
                      ? "#2C2D2D"
                      : "#C2C2C2"
                    : "gray"
                }
                sx={{ position: "absolute", right: "8px", bottom: "2px" }}
              >
                {format(data.created_at, "HH:mm")}
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={handleEditStart}
          disabled={isLoading}
          sx={{ fontSize: "14px" }}
        >
          <EditIcon className="mr-2" fontSize="small" />
          {t("chats.messages.edit")}
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          disabled={isLoading}
          sx={{ fontSize: "14px" }}
          color="error"
        >
          <DeleteIcon color="error" className="mr-2" fontSize="small" />
          {t("chats.messages.delete")}
        </MenuItem>
      </Menu>
    </Box>
  );
};
