"use client";

import { Box, CircularProgress } from "@mui/material";
import { useLayoutEffect, useRef } from "react";
import { IMessage } from "../types";
import { Message } from "./Message";

type ChatBodyProps = {
  userId: string;
  messages: IMessage[];
};

export const ChatBody: React.FC<ChatBodyProps> = ({ userId, messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 flex justify-center overflow-y-auto z-10 h-full"
    >
      {messages.length ? (
        <Box className="flex flex-col w-full max-w-[600px] p-2 gap-4 h-fit z-1">
          {messages.map((data, index) => (
            <Message
              key={index}
              isMineMessage={userId === data.sender_id}
              data={data}
            />
          ))}
        </Box>
      ) : (
        <Box className="flex justify-center items-center flex-1">
          <CircularProgress color="inherit" />
        </Box>
      )}
    </div>
  );
};
