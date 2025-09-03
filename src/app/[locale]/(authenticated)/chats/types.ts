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
  sender?: Pick<
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
