import { IUser } from "../players/types";

enum MESSAGE_TYPE {
  text = "text",
  file = "file",
  location = "location",
  photo = "photo",
}

export interface IMessage {
  message_id: string;
  sender_id: string;
  profiles?: Pick<
    IUser,
    "id" | "user_name" | "first_name" | "last_name" | "avatar_url"
  >;
  created_at: string;
  type: MESSAGE_TYPE;
  text?: string;
}

export type GetMessages = {
  request: null;
  response: IMessage[];
};
export type GetOneMessage = {
  request: null;
  response: IMessage;
};
export type PostMessage = {
  request: IMessage;
  response: IMessage;
};
export type PutMessage = {
  request: IMessage;
  response: IMessage;
};

export interface ISubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export type PostSubscription = {
  request: ISubscription;
  response: { message: string };
};

export type DeleteSubscription = {
  request: undefined;
  response: { message: string };
};
