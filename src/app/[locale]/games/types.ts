import { GAME_STATUS } from "@/config";
import { z } from "zod";

export const gameFormSchema = (t: (key: string) => string) =>
  z.object({
    description: z.string().min(10, t("validation.required")),
    location_id: z.string().min(10, t("validation.required")),
    date: z.string().min(3, t("validation.required")), // January 10
    duration: z.number().min(1, t("validation.required")), // 90 minutes
    reserved: z.boolean(),
    status: z.nativeEnum(GAME_STATUS),
    cancelled_reason: z.string().min(10, t("validation.required")).nullable(),
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
