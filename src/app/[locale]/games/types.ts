import { GAME_STATUS } from "@/config";
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
export type PostGame = {
  request: IGameForm;
  response: IGame;
};
export type PutGame = {
  request: IGameForm;
  response: IGame;
};
