export type LeaderboardEntry = {
  attempts: number;
  time: number;
  length: number;
  base: number;
};

export function createLeaderboardEntry(entry: LeaderboardEntry): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'leaderboard__desc';
  li.textContent = `attempts ${entry.attempts}, ${entry.time}s — length ${entry.length}, base ${entry.base}`;
  return li;
}
export function createLeaderboard(entries: LeaderboardEntry[]): HTMLElement {
  const board = document.createElement('div');
  board.className = 'leaderboard';

  const title = document.createElement('p');
  title.className = 'leaderboard__title';
  title.textContent = 'Leaderboard';
  board.appendChild(title);

  if (entries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'leaderboard__desc leaderboard__desc--empty';
    empty.textContent = 'Пока нет результатов';
    board.appendChild(empty);
    return board;
  }

  const list = document.createElement('ol');
  list.className = 'leaderboard__list';
  entries.forEach((entry) => list.appendChild(createLeaderboardEntry(entry)));
  board.appendChild(list);

  return board;
}
