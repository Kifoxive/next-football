"use server";
import webpush from "web-push";

webpush.setVapidDetails(
  `mailto:${process.env.DEVELOPER_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// In-memory placeholder: in production, store per user
import type { PushSubscription as WebPushSubscription } from "web-push";

let subscriptions: WebPushSubscription[] = [];

export async function subscribeUser(sub: WebPushSubscription) {
  subscriptions.push(sub);
  return { success: true };
}

export async function unsubscribeUser() {
  subscriptions = [];
  return { success: true };
}

export async function sendNotification(message: string) {
  const payload = JSON.stringify({
    title: "New Message",
    body: message,
    url: "/",
  });

  await Promise.allSettled(
    subscriptions.map((sub) => webpush.sendNotification(sub, payload))
  );
  return { success: true };
}
