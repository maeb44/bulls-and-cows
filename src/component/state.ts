import type { baseOfSecret, lengthOfSecret } from '../types';
import type { LeaderboardEntry } from './menu/createLeaderBoard';

type state = {
  base: baseOfSecret;
  length: lengthOfSecret;
  secret: string[];
  leaderBoard: LeaderboardEntry[];
  startedAt: number | null;
};
export const state: state = {
  base: 2,
  length: 2,
  secret: [],
  leaderBoard: [],
  startedAt: null,
};
