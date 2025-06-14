import { z } from "zod";

export const locationFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(8, t("validation.required")),
    description: z.string().min(10, t("validation.required")),
    address: z.string().min(10, t("validation.required")),
    price_per_hour: z.number(),
    floor_type: z.string().min(1, t("validation.required")),
    building_type: z.string().min(1, t("validation.required")),
    latitude: z.number({ message: t("validation.required") }),
    longitude: z.number({ message: t("validation.required") }),
    image_list: z.array(z.string()),
  });

export type ILocationForm = z.infer<ReturnType<typeof locationFormSchema>>;

export interface ILocation {
  // basic
  id: string;
  // form
  name: string;
  description: string;
  address: string;
  price_per_hour: number;
  floor_type: string;
  building_type: string;
  latitude: number;
  longitude: number;
  image_list: string[];
  // info
  created_at: string;
  updated_at: string | null;
  created_by: string;
}
