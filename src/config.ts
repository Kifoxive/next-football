import { USER_ROLE } from "./store/auth";

export type lang = "cs" | "uk" | "en";

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
  live = "live",
  completed = "completed",
  cancelled = "cancelled",
}

// Deprecated - use GAME_STATUS instead
// export enum LIVE_GAME_STATUS {
//   waiting_for_kickoff = "waiting_for_kickoff",
//   in_progress = "in_progress",
//   paused = "paused",
//   ended = "completed",
// }

export enum MOVE_TYPE {
  // regular_play = "regular_play",
  regular_goal = "regular_goal",
  header_goal = "header_goal",
  corner_goal = "corner_goal",
  long_goal = "long_goal",
  penalty = "penalty",
  free_kick = "free_kick",
  own_goal = "own_goal",
}

export enum ASSIST_TYPE {
  regular_play = "regular_play",
  corner = "corner",
  free_kick = "free_kick",
  throw_in = "throw_in",
  penalty = "penalty",
}

export enum VOTE_OPTION {
  yes = "yes",
  no = "no",
  maybe = "maybe",
}

export enum LANGUAGE {
  en = "en",
  uk = "uk",
  cs = "cs",
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
      edit: "/players/:id/edit",
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
    },
    activate: "/activate",
    signUp: "/signUp",
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
      options: "/players/options",
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
        subscribe: "/messages/subscribe",
      },
    },
  },
  buckets: {
    locations: "locations-bucket",
    profiles: "profiles-bucket",
  },
};

export const VALID_GAME_STATUS_TRANSITIONS: Record<GAME_STATUS, GAME_STATUS[]> =
  {
    [GAME_STATUS.initialization]: [GAME_STATUS.voting, GAME_STATUS.cancelled],
    [GAME_STATUS.voting]: [GAME_STATUS.confirmed, GAME_STATUS.cancelled],
    [GAME_STATUS.confirmed]: [GAME_STATUS.live, GAME_STATUS.cancelled],
    [GAME_STATUS.live]: [GAME_STATUS.completed],
    [GAME_STATUS.completed]: [],
    [GAME_STATUS.cancelled]: [GAME_STATUS.confirmed],
  };

export const VALID_GAME_STATUS_TRANSITIONS_FRONTEND: Record<
  GAME_STATUS,
  GAME_STATUS[]
> = {
  [GAME_STATUS.initialization]: [
    GAME_STATUS.initialization,
    GAME_STATUS.voting,
    GAME_STATUS.cancelled,
  ],
  [GAME_STATUS.voting]: [
    GAME_STATUS.voting,
    GAME_STATUS.confirmed,
    GAME_STATUS.cancelled,
  ],
  [GAME_STATUS.confirmed]: [
    GAME_STATUS.confirmed,
    GAME_STATUS.live,
    GAME_STATUS.cancelled,
  ],
  [GAME_STATUS.live]: [GAME_STATUS.live, GAME_STATUS.completed],
  [GAME_STATUS.completed]: [GAME_STATUS.completed],
  [GAME_STATUS.cancelled]: [GAME_STATUS.cancelled, GAME_STATUS.confirmed],
};
