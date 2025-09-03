"use client";

import { useTranslations } from "next-intl";
import { useDocumentTitle } from "@/hooks";
import { useAuthStore } from "@/store/auth";
import { ChatBody } from "./_components/ChatBody";
import { GetMessages, IMessage, PostMessage } from "./types";
import { Box, useTheme } from "@mui/material";
import { MessageInput } from "./_components/MessageInput";
import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axiosClient";
import { config } from "@/config";
import toast from "react-hot-toast";
import { useRealtimeMessages } from "@/utils/supabase/client";
import { BackButton } from "@/components/BackButton";

export default function ChatPage() {
  const t = useTranslations("chats");
  useDocumentTitle(t("title"));

  const [messages, setMessages] = useState<IMessage[]>([]);
  const authUser = useAuthStore((s) => s.user);
  const theme = useTheme();
  const isLightTheme = theme.palette.mode === "light";

  useRealtimeMessages((newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosClient.get<GetMessages["response"]>(
          config.endpoints.messages.main.list
        );
        setMessages(res.data);
      } catch (error) {
        console.error(error);
        toast.error(t("fetchError"));
      }
    };

    fetchMessages();
  }, []);

  const onMessageSend = async (text: string) => {
    try {
      const { data } = await axiosClient.post<PostMessage["response"]>(
        config.endpoints.messages.main.new,
        {
          type: "text",
          text,
        }
      );

      setMessages((prev) => [...prev, data]);
    } catch {
      toast.error(t("messages.error"));
    }
  };

  if (!authUser) return;

  return (
    <div className="relative flex flex-1 flex-col h-full">
      <Box className="fixed flex m-4 sm:m-6 w-fit items-center gap-2 backdrop-blur-sm bg-white/20 rounded-md px-3 py-1 z-40">
        <BackButton />
        {/* <Typography variant="h6" fontWeight="bold" component="h1">
          {t("title")}
        </Typography> */}
      </Box>
      <div
        className={`fixed inset-0 bg-[url(/images/football_wallpaper.png)] bg-repeat-x bg-[length:auto_100%]
                ${isLightTheme && "invert"}`}
      ></div>
      {/* Scrollable content */}
      <ChatBody userId={authUser.id} messages={messages} />
      {/* Fixed bottom section */}
      <div className="w-full flex justify-center">
        <Box
          className="w-full flex justify-center max-w-[640px] p-3 relative
    before:content-[''] 
    before:absolute 
    before:top-0 
    before:left-0 
    before:w-full 
    before:h-[1px] 
    before:bg-[linear-gradient(90deg,rgba(127,127,127,0)_0%,rgba(127,127,127,0.4)_2%,rgba(127,127,127,0.4)_98%,rgba(127,127,127,0)_100%)]"
        >
          <MessageInput onMessageSend={onMessageSend} />
        </Box>
      </div>
    </div>
  );
}
