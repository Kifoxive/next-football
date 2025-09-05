"use client";

import { useTranslations } from "next-intl";
import { useDocumentTitle } from "@/hooks";
import { useAuthStore } from "@/store/auth";
import { ChatBody } from "./_components/ChatBody";
import {
  DeleteSubscription,
  GetMessages,
  IMessage,
  PostMessage,
  PostSubscription,
} from "./types";
import { Badge, Box, IconButton, useTheme } from "@mui/material";
import { MessageInput } from "./_components/MessageInput";
import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axiosClient";
import { config } from "@/config";
import toast from "react-hot-toast";
import { useRealtimeMessages } from "@/utils/supabase/client";
import { BackButton } from "@/components/BackButton";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAppStore } from "@/store/app";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64Safe);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export default function ChatPage() {
  const t = useTranslations("chats");
  useDocumentTitle(t("title"));

  const [messages, setMessages] = useState<IMessage[]>([]);
  const authUser = useAuthStore((s) => s.user);
  const theme = useTheme();
  const isLightTheme = theme.palette.mode === "light";
  const subscription = useAppStore((s) => s.subscription);
  const setSubscription = useAppStore((s) => s.setSubscription);
  const removeSubscription = useAppStore((s) => s.removeSubscription);

  // enable realtime messages update
  useRealtimeMessages((newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  });

  // fetch all messages
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

  // send message
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

  // subscribe user to push notifications
  const subscribe = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
      setSubscription(subscription);
      await axiosClient.post<PostSubscription["response"]>(
        config.endpoints.messages.main.subscribe,
        subscription
      );
    } catch (e) {
      console.error(e);
    }
  };

  // unsubscribe user from push notifications
  const unsubscribe = async () => {
    try {
      // remove subscription in service worker
      await subscription?.unsubscribe();
      // remove service worker from store
      removeSubscription();
      // remove subscription on the server
      await axiosClient.delete<DeleteSubscription["response"]>(
        config.endpoints.messages.main.subscribe
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (!authUser) return;

  return (
    <div className="relative flex flex-1 flex-col h-full">
      <Box className="fixed flex m-4 sm:m-6 w-fit items-center gap-2 backdrop-blur-sm bg-white/20 rounded-md px-3 py-1 z-40">
        <BackButton />
        {subscription ? (
          <IconButton size="small" onClick={unsubscribe}>
            <Badge color="success" variant="dot">
              <NotificationsOffIcon fontSize="small" />
            </Badge>
          </IconButton>
        ) : (
          <IconButton
            size="small"
            onClick={subscribe}
            disabled={!("PushManager" in window)}
          >
            <Badge color="error" variant="dot">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
        )}
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
