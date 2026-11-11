import type { LeaderboardEntry } from './menu/createLeaderBoard';

const KEY = 'bulls-and-cows:leaderboard';

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function addLeaderboardEntry(entry: LeaderboardEntry): void {
  const entries = loadLeaderboard();
  entries.push(entry);
  entries.sort((a, b) => a.attempts - b.attempts || a.time - b.time);
  saveLeaderboard(entries.slice(0, 10));
}
