// import { phoneRegex } from 'utils';

import { USER_ROLE } from "@/store/auth";
import { z } from "zod";

export const userFormSchema = (t: (key: string) => string) =>
  z.object({
    user_name: z.string().min(1, t("validation.required")),
    email: z.string().nullable(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    role: z.nativeEnum(USER_ROLE).default(USER_ROLE.player),
  });

export type IUserForm = z.infer<ReturnType<typeof userFormSchema>>;

export interface IUser {
  // basic
  id: string;
  auth_user_id: string;
  // form
  user_name: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: USER_ROLE;
  // info
  created_by: string;
  created_at: string;
  updated_at: string;
  invited_at: string | null;
  joined_at: string | null;
}

export type GetUsers = {
  request: null;
  response: IUser[];
};
export type PostUser = {
  request: IUserForm;
  response: IUser;
};
export type PutUser = {
  request: IUserForm;
  response: IUser;
};
