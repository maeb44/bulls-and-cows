import type { baseOfSecret, lengthOfSecret } from '../types';
import type { LeaderboardEntry } from './menu/createLeaderBoard';

export type Attempt = {
  guess: string;
  bulls: number;
  cows: number;
};

type State = {
  base: baseOfSecret;
  length: lengthOfSecret;
  secret: string[];
  leaderBoard: LeaderboardEntry[];
  startedAt: number | null;
  history: Attempt[];
};

export const state: State = {
  base: 2,
  length: 2,
  secret: [],
  leaderBoard: [],
  startedAt: null,
  history: [],
};
