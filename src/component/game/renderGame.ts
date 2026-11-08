import { state } from '../state';
import { evaluateGuess } from '../../utils/evaluateGuess';
import { generateSecret } from '../../utils/generateSecret';
import { createDigitValidator } from '../../utils/createDigitValidator';
import { addLeaderboardEntry } from '../storage';

export function renderGame(
  onBackToMenu: () => void,
  onNewGame: () => void,
): { element: HTMLElement; startTimer: () => void } {
  state.secret = generateSecret(state.length, state.base);
  state.startedAt = null;

  const game = document.createElement('div');
  game.className = 'game';

  const title = document.createElement('h1');
  title.className = 'app__title';
  title.textContent = 'Bulls and Cows';
  game.appendChild(title);

  // --- Параметры ---
  const params = document.createElement('div');
  params.className = 'game__params';

  const lengthSpan = document.createElement('span');
  lengthSpan.innerHTML = `Length: <strong>${state.length}</strong>`;

  const baseSpan = document.createElement('span');
  baseSpan.innerHTML = `Base: <strong>${state.base}</strong>`;

  const timerSpan = document.createElement('span');
  timerSpan.innerHTML = `Время: <strong id="game-timer">0s</strong>`;

  params.append(lengthSpan, baseSpan, timerSpan);
  game.appendChild(params);

  const inputSection = document.createElement('div');
  inputSection.className = 'game__section';

  const inputLabel = document.createElement('label');
  inputLabel.className = 'game__label';
  inputLabel.htmlFor = 'game-input';
  inputLabel.textContent = 'Ваш ход';

  const input = document.createElement('input');
  input.id = 'game-input';
  input.className = 'game__input';
  input.type = 'text';
  input.maxLength = state.length;
  input.placeholder = `Введите ${state.length} символа`;

  const checkBtn = document.createElement('button');
  checkBtn.className = 'game__btn';
  checkBtn.textContent = 'Проверить';
  checkBtn.disabled = true;

  inputSection.append(inputLabel, input, checkBtn);
  game.appendChild(inputSection);

  const historySection = document.createElement('div');
  historySection.className = 'game__section';

  const historyLabel = document.createElement('span');
  historyLabel.className = 'game__label';
  historyLabel.textContent = 'История';

  const history = document.createElement('div');
  history.className = 'game__history';

  const empty = document.createElement('p');
  empty.className = 'game__history-empty';
  empty.textContent = 'Пока нет попыток';
  history.appendChild(empty);

  historySection.append(historyLabel, history);
  game.appendChild(historySection);

  const backBtn = document.createElement('button');
  backBtn.className = 'game__btn game__btn--back';
  backBtn.textContent = 'В меню';

  const newGameBtn = document.createElement('button');
  newGameBtn.className = 'game__btn game__btn--new';
  newGameBtn.textContent = 'Новая игра';

  let timerId: ReturnType<typeof setInterval> | null = null;

  const updateTimer = (): void => {
    const el = document.getElementById('game-timer');
    if (!el || state.startedAt === null) return;
    const seconds = Math.max(1, Math.ceil((Date.now() - state.startedAt) / 1000));
    el.textContent = `${seconds}s`;
  };

  const startTimer = (): void => {
    if (timerId !== null) return;
    state.startedAt = Date.now();
    timerId = setInterval(updateTimer, 1000);
  };

  const stopTimer = (): void => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const onInput = (): void => {
    const lastChar = input.value.at(-1);
    if (!lastChar) return;

    const validator = createDigitValidator(state.base);
    if (!validator(lastChar)) {
      input.value = input.value.slice(0, -1);
      return;
    }

    checkBtn.disabled = input.value.length !== state.length;
  };

  const onCheck = (): void => {
    const guess = input.value;
    if (guess.length !== state.length) return;

    startTimer();

    const result = evaluateGuess(state.secret, guess);

    empty.remove();

    const row = document.createElement('div');
    row.className = 'game__history-row';

    const guessSpan = document.createElement('span');
    guessSpan.className = 'game__history-row-guess';
    guessSpan.textContent = guess;

    const bullsSpan = document.createElement('span');
    bullsSpan.className = 'game__history-row-bulls';
    bullsSpan.textContent = `${result.bulls} ${
      result.bulls === 1 ? 'бык' : result.bulls >= 2 && result.bulls <= 4 ? 'быка' : 'быков'
    }`;

    const cowsSpan = document.createElement('span');
    cowsSpan.className = 'game__history-row-cows';
    cowsSpan.textContent = `${result.cows} ${
      result.cows === 1 ? 'корова' : result.cows >= 2 && result.cows <= 4 ? 'коровы' : 'коров'
    }`;

    row.append(guessSpan, bullsSpan, cowsSpan);
    history.prepend(row);

    input.value = '';
    checkBtn.disabled = true;

    if (result.bulls === state.length) {
      stopTimer();
      updateTimer();

      const seconds = state.startedAt
        ? Math.max(1, Math.ceil((Date.now() - state.startedAt) / 1000))
        : 1;
      const attempts = history.children.length;

      addLeaderboardEntry({
        attempts,
        time: seconds,
        length: state.length,
        base: state.base,
      });

      const win = document.createElement('p');
      win.className = 'game__win';
      win.textContent = `Победа! Секрет угадан за ${attempts} попыток и ${seconds}s.`;
      game.appendChild(win);
      input.disabled = true;
      checkBtn.disabled = true;
    }
  };

  input.addEventListener('input', onInput);
  checkBtn.addEventListener('click', onCheck);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !checkBtn.disabled) onCheck();
  });

  backBtn.addEventListener('click', () => {
    stopTimer();
    onBackToMenu();
  });

  newGameBtn.addEventListener('click', () => {
    stopTimer();
    onNewGame();
  });

  game.appendChild(newGameBtn);
  game.appendChild(backBtn);

  return { element: game, startTimer };
}
