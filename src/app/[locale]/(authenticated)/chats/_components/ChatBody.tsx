"use client";

import { Box, CircularProgress, IconButton } from "@mui/material";
import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { IMessage } from "../types";
import { Message } from "./Message";
import { DateSeparator } from "./DateSeparator";
import { startOfDay } from "date-fns";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTheme } from "next-themes";

type ChatBodyProps = {
  userId: string;
  messages: IMessage[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, text: string) => void;
  isLoading?: boolean;
};

export const ChatBody: React.FC<ChatBodyProps> = ({
  userId,
  messages,
  onLoadMore,
  hasMore,
  isLoadingMore,
  onDelete,
  onEdit,
  isLoading = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Auto-scroll to bottom on new messages
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el && !isScrolledUp) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isScrolledUp]);

  // Detect if scrolled up
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setIsScrolledUp(!isAtBottom);
    }
  }, []);

  // Infinite scroll observer
  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreTriggerRef.current) {
      observer.observe(loadMoreTriggerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Scroll to bottom
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
      setIsScrolledUp(false);
    }
  };

  // Group messages by date
  const groupedMessages: { date: Date; messages: IMessage[] }[] = [];
  const dateMap = new Map<string, IMessage[]>();

  messages.forEach((msg) => {
    const date = startOfDay(new Date(msg.created_at));
    const key = date.toISOString();
    if (!dateMap.has(key)) {
      dateMap.set(key, []);
    }
    dateMap.get(key)!.push(msg);
  });

  dateMap.forEach((msgs, dateStr) => {
    groupedMessages.push({ date: new Date(dateStr), messages: msgs });
  });

  return (
    <>
      <div
        ref={scrollRef}
        className="flex-1 flex justify-center overflow-y-auto z-10 h-full scroll-container"
        onScroll={handleScroll}
      >
        {messages.length ? (
          <Box className="flex flex-col w-full max-w-[600px] p-2 gap-4 h-fit z-1">
            {/* Load more trigger */}
            <div
              ref={loadMoreTriggerRef}
              className="h-8 flex items-center justify-center"
            >
              {isLoadingMore && <CircularProgress size={24} />}
            </div>

            {/* Grouped messages with date separators */}
            {groupedMessages.map((group) => (
              <div
                key={group.date.toISOString()}
                className="flex flex-col gap-4"
              >
                <DateSeparator date={group.date} />
                {group.messages.map((msg, i) => (
                  <Message
                    key={msg.id}
                    isMineMessage={userId === msg.sender_id}
                    data={msg}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    isLoading={isLoading}
                    isPreviousMessageTheSamePerson={
                      msg.sender_id === group.messages[i - 1]?.sender_id
                    }
                  />
                ))}
              </div>
            ))}
          </Box>
        ) : (
          <Box className="flex justify-center items-center flex-1">
            <CircularProgress color="inherit" />
          </Box>
        )}
      </div>

      {/* Scroll to bottom button */}
      {isScrolledUp && (
        <div className="absolute bottom-10 right-4 z-30">
          <IconButton
            onClick={scrollToBottom}
            size="medium"
            color="default"
            sx={{
              backgroundColor: isDark ? "#222222" : "#ffffff",
              opacity: "0.8",
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </div>
      )}
    </>
  );
};
