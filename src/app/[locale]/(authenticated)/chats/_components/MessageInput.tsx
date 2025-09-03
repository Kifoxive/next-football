"use client";
import { Box, ClickAwayListener, IconButton, useTheme } from "@mui/material";
import { useState } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";

type IMessageInput = {
  onMessageSend: (text: string) => void;
};

export const MessageInput: React.FC<IMessageInput> = ({ onMessageSend }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const theme = useTheme();
  const isLightTheme = theme.palette.mode === "light";

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleSend = () => {
    if (message.trim()) {
      onMessageSend(message.trim());
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  return (
    <Box className="w-full">
      <Box
        className={`flex items-center p-2 rounded-3xl shadow-sm ${
          isLightTheme ? "bg-gray-100" : "bg-gray-800"
        }`}
      >
        <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
          <InsertEmoticonIcon />
        </IconButton>

        <input
          type="text"
          className={`flex-1 px-3 py-2 outline-none rounded-full ${
            isLightTheme ? "bg-white text-black" : "bg-gray-700 text-white"
          }`}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <IconButton onClick={handleSend} color="primary">
          <SendIcon />
        </IconButton>
      </Box>

      {showEmojiPicker && (
        <Box className="absolute bottom-14 left-2 z-50">
          <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
            {/* Wrap picker so it can receive a ref */}
            <div>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={isLightTheme ? Theme.LIGHT : Theme.DARK}
              />
            </div>
          </ClickAwayListener>
        </Box>
      )}
    </Box>
  );
};
