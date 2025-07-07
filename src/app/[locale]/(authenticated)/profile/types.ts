import { z } from "zod";

export const profileFormSchema = (t: (key: string) => string) =>
  z.object({
    user_name: z.string().min(1, t("validation.required")),
    // email: z.string().nullable(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    bio: z.string().nullable(),
    // language: z.nativeEnum(LANGUAGE),
  });

export type IProfileForm = z.infer<ReturnType<typeof profileFormSchema>>;
