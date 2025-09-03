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

export enum GAME_STATUS {
  initialization = "initialization",
  voting = "voting",
  confirmed = "confirmed",
  completed = "completed",
  cancelled = "cancelled",
}

export enum VOTE_OPTION {
  yes = "yes",
  no = "no",
  maybe = "maybe",
}

export enum LANGUAGE {
  en = "en",
  uk = "uk",
  cz = "cz",
}

export type IActivationToken = {
  userId: string;
  inviterId: string;
  iat: number;
  exp: number;
};

export const config = {
  routes: {
    home: "/",
    games: {
      new: "/games/new",
      detail: "/games/:id",
      edit: "/games/:id/edit",
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
    chats: {
      main: "/chats",
    },
    profile: {
      edit: "/profile/edit",
      activate: "/profile/activate",
    },
    login: "/login",
    unauthorized: "/unauthorized",
    logout: "/logout",
  },
  endpoints: {
    auth: {
      me: "/auth/me",
      invite: "/auth/activate",
      checkActivated: "/auth/activate/:id",
      generateActivationLink: "/auth/generate-activation-link",
      activate: "/auth/activate",
    },
    games: {
      new: "/games",
      detail: "/games/:id",
      edit: "/games/:id",
      list: "/games",
      delete: "/games/:id",
      vote: "/games/:id/votes",
    },
    players: {
      new: "/players",
      detail: "/players/:id",
      edit: "/players/:id",
      delete: "/players/:id",
      list: "/players",
    },
    locations: {
      new: "/locations",
      detail: "/locations/:id",
      edit: "/locations/:id",
      list: "/locations",
      delete: "/locations/:id",
      options: "/locations/options",
    },
    messages: {
      main: {
        new: "/messages",
        list: "/messages",
      },
    },
  },
  buckets: {
    locations: "locations-bucket",
    profiles: "profiles-bucket",
  },
};
