"use client";

import { useTranslations } from "next-intl";
import { useDocumentTitle } from "@/hooks";
import { useAuthStore } from "@/store/auth";
import {
  DeleteSubscription,
  GetMessages,
  IMessage,
  PostMessage,
  PostSubscription,
} from "../chats/types";
import { Badge, Box, IconButton, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axiosClient";
import { config } from "@/config";
import toast from "react-hot-toast";
import { useRealtimeMessages } from "@/utils/supabase/client";
import { BackButton } from "@/components/BackButton";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAppStore } from "@/store/app";
import { MessageInput } from "../chats/_components/MessageInput";
import { ChatBody } from "../chats/_components/ChatBody";

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
  const [isSubActionLoading, setIsSubActionLoading] = useState(false);
  const [isSendMessageLoading, setIsSendMessageLoading] = useState(false);

  // enable realtime messages update
  useRealtimeMessages((newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  });

  // fetch all messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsSendMessageLoading(true);
      try {
        const res = await axiosClient.get<GetMessages["response"]>(
          config.endpoints.messages.main.list
        );
        setMessages(res.data);
      } catch (error) {
        console.error(error);
        toast.error(t("fetchError"));
      } finally {
        setIsSendMessageLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // send message
  const onMessageSend = async (text: string) => {
    try {
      await axiosClient.post<PostMessage["response"]>(
        config.endpoints.messages.main.new,
        {
          type: "text",
          text,
        }
      );
    } catch {
      toast.error(t("messages.error"));
    }
  };

  // subscribe user to push notifications
  const subscribe = async () => {
    try {
      setIsSubActionLoading(true);
      // add subscription in service worker
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
      // remove subscription on the server
      await axiosClient.post<PostSubscription["response"]>(
        config.endpoints.messages.main.subscribe,
        subscription
      );
      // remove service worker to the store
      setSubscription(subscription);
    } catch (e) {
      console.error(e);
      toast.error(t("subscriptions.subscribe_failed"));
    } finally {
      setIsSubActionLoading(false);
    }
  };

  // unsubscribe user from push notifications
  const unsubscribe = async () => {
    setIsSubActionLoading(true);
    try {
      // remove subscription on the server
      await axiosClient.delete<DeleteSubscription["response"]>(
        config.endpoints.messages.main.subscribe
      );
      // remove subscription in service worker
      await subscription?.unsubscribe();
      // remove service worker from store
      removeSubscription();
    } catch (e) {
      console.error(e);
      toast.error(t("subscriptions.unsubscribe_failed"));
    } finally {
      setIsSubActionLoading(false);
    }
  };

  if (!authUser) return;

  return (
    <>
      <Box className="fixed top-14 sm:top-[65px] sm:left-25 flex m-4 sm:m-6 w-fit items-center gap-2 backdrop-blur-sm bg-white/20 rounded-sm px-3 py-1 z-40">
        <BackButton />
        {subscription ? (
          <IconButton
            size="small"
            onClick={unsubscribe}
            disabled={isSubActionLoading}
          >
            <Badge color="success" variant="dot">
              <NotificationsOffIcon fontSize="small" />
            </Badge>
          </IconButton>
        ) : (
          <IconButton
            size="small"
            onClick={subscribe}
            disabled={
              isSubActionLoading ||
              !("serviceWorker" in navigator && "PushManager" in window)
            }
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
      <div className="flex flex-col h-screen sm:h-auto overflow-hidden flex-1">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto scroll-container">
          <ChatBody userId={authUser.id} messages={messages} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 w-full flex justify-center">
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
            <MessageInput
              onMessageSend={onMessageSend}
              isLoading={isSendMessageLoading}
            />
          </Box>
        </div>
      </div>
    </>
  );
}
