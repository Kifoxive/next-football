import { USER_ROLE } from "./store/auth";

export type lang = "cz" | "uk" | "en";

export const permissions = {
  admin: [USER_ROLE.admin],
  moderator: [USER_ROLE.admin, USER_ROLE.moderator],
  player: [USER_ROLE.admin, USER_ROLE.moderator, USER_ROLE.player],
};

export enum FLOOR_TYPE_ENUM {
  artificial_grass = "artificial_grass",
  natural_grass = "natural_grass",
  parquet = "parquet",
  rubber = "rubber",
  sand = "sand",
  asphalt = "asphalt",
}
export enum BUILDING_TYPE_ENUM {
  indoor = "indoor",
  outdoor = "outdoor",
  covered_outdoor = "covered_outdoor",
}

export const config = {
  routes: {
    home: "/",
    profile: "/profile",
    games: {
      new: "/games/new",
      detail: "/games/:id",
      list: "/games",
    },
    players: {
      new: "/players/new",
      detail: "/players/:id",
      edit: "players/:id/edit",
      list: "/players",
    },
    locations: {
      new: "/locations/new",
      detail: "/locations/:id",
      edit: "/locations/:id/edit",
      list: "/locations",
    },
    login: "/login",
  },
  endpoints: {
    players: "/players",
    locations: "/locations",
  },
  buckets: {
    locations: "locations-bucket",
  },
};
