"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app";

export const SubscriptionInitializer = () => {
  const subscribe = useAppStore((s) => s.setSubscription);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        reg.pushManager.getSubscription().then(subscribe);
      });
    }
  }, []);

  return null;
};
