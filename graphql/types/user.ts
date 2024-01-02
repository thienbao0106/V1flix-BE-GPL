import { ISeries } from "./series";

interface IUserList {
  series: ISeries;
  status: string;
  currentEp: number;
  note: string;
}

interface IUserStats {
  total_episodes: number;
  days_watched: number;
}

export interface IUser {
  _id: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
  list: [IUserList];
  favoriteList: [ISeries];
  stats: IUserStats;
}
