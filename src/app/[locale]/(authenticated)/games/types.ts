import { TFunction } from "@/utils/types";
import { ASSIST_TYPE, GAME_STATUS, MOVE_TYPE, VOTE_OPTION } from "@/config";
import { z } from "zod";
import { ILocation } from "../locations/types";
import { PlayerOptionType } from "../players/types";

export const gameFormSchema = (t: TFunction) =>
  z.object({
    description: z
      .string({ message: t("validation.required") })
      .min(10, t("validation.minLengthFew", { minLength: 10 })),
    location_id: z
      .string({ message: t("validation.required") })
      .min(1, t("validation.required")),
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

export const gameLobbyFormSchema = (t: TFunction) =>
  z.object({
    participants: z
      .array(
        z.object({
          label: z.string({ message: t("validation.stringFormat") }),
          value: z.string({ message: t("validation.stringFormat") }),
        })
      )
      .min(2, t("validation.participantsMinLength", { minLength: 2 })),
    moderators: z.array(
      z.object({
        label: z.string({ message: t("validation.stringFormat") }),
        value: z.string({ message: t("validation.stringFormat") }),
      })
    ),
  });

export type IGameLobbyForm = z.infer<ReturnType<typeof gameLobbyFormSchema>>;

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
  cancelled_reason: string | null;
  // status & live tracking
  status: GAME_STATUS;
  moderators: PlayerOptionType[] | null;
  participants: PlayerOptionType[] | null;
  started_at: string | null;
  ended_at: string | null;
  // metadata
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
export type GetFreshGames = {
  request: null;
  response: (IGame & { locations: Pick<ILocation, "name" | "image_list"> })[];
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

// goals
export interface IGoal {
  // basic
  id: number;
  game_id: string;
  // form
  scorer_id: string;
  is_scorer_goalkeeper: boolean;
  assist_id: string | null;
  is_assist_goalkeeper: boolean;
  time: string; // ISO timestamp of the goal
  type: MOVE_TYPE;
  assist_type: ASSIST_TYPE;
  // info
  created_at: string;
  created_by: string;
}

export type PostGoal = {
  request: Omit<IGoal, "id" | "created_at">;
  response: IGoal;
};

export type GetGoals = {
  request: null;
  response: IGoal[];
};
