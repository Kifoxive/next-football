import { GAME_STATUS, VOTE_OPTION } from "@/config";
import { z } from "zod";
import { ILocation } from "../locations/types";

export const gameFormSchema = (
  t: (key: string, param?: Record<string, string | number>) => string
) =>
  z.object({
    description: z
      .string({ message: t("validation.required") })
      .min(10, t("validation.minLengthFew", { minLength: 10 })),
    location_id: z
      .string({ message: t("validation.required") })
      .min(10, t("validation.required")),
    date: z
      .string({ message: t("validation.required") })
      .min(3, t("validation.required")), // January 10
    duration: z
      .number({ message: t("validation.required") })
      .min(1, t("validation.required")), // 90 minutes
    reserved: z.boolean({ message: t("validation.required") }),
    min_yes_votes_count: z
      .number({ message: t("validation.required") })
      .min(1, t("validation.minLengthFew", { minLength: 1 })),
    status: z.nativeEnum(GAME_STATUS),
    cancelled_reason: z
      .string({ message: t("validation.required") })
      .min(10, t("validation.minLengthFew", { minLength: 10 }))
      .nullable(),
  });

export type IGameForm = z.infer<ReturnType<typeof gameFormSchema>>;

export interface IGame {
  // basic
  id: string;
  location_id: string;
  // form
  description: string;
  date: string;
  duration: number;
  reserved: boolean;
  min_yes_votes_count: number;
  status: GAME_STATUS;
  cancelled_reason: string | null;
  // info
  created_at: string;
  created_by: string;
}

export type GetGames = {
  request: null;
  response: (IGame & { locations: Pick<ILocation, "name"> })[];
};
export type GetOneGame = {
  request: null;
  response: IGame & { locations: ILocation; votes: IVote[] };
};
export type PostGame = {
  request: IGameForm;
  response: IGame;
};
export type PutGame = {
  request: IGameForm;
  response: IGame;
};

// voting
export interface IVote {
  // basic
  id: string;
  user_id: string;
  game_id: string;
  // form
  vote: VOTE_OPTION;
  // info
  created_at: string;
  updated_at: string;
}

export type PostVote = {
  request: Omit<IVote, "id" | "created_at" | "updated_at">;
  response: IVote;
};
