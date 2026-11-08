import { countPossibleSecrets } from '../../utils/countPossibleSecrets';
import { state } from '../state';
import { createLeaderboard } from './createLeaderBoard';
import { LENGTHS, isLengthOfSecret, type baseOfSecret } from '../../types';
import { loadLeaderboard } from '../storage';

const BASES: { value: baseOfSecret; label: string }[] = [
  { value: 2, label: 'bin(2)' },
  { value: 8, label: 'oct(8)' },
  { value: 10, label: 'dec(10)' },
  { value: 16, label: 'hex(16)' },
];

function createTitle(text: string): HTMLParagraphElement {
  const p = document.createElement('p');
  p.className = 'menu__title';
  p.textContent = text;
  return p;
}

function createRadio(
  name: string,
  value: number,
  label: string,
  checked: boolean,
  extraClass = '',
): HTMLLabelElement {
  const labelEl = document.createElement('label');
  labelEl.className = `radio ${extraClass}`.trim();

  const input = document.createElement('input');
  input.type = 'radio';
  input.name = name;
  input.value = String(value);
  input.checked = checked;

  const box = document.createElement('span');
  box.className = 'radio__box';
  box.textContent = label;

  labelEl.append(input, box);
  return labelEl;
}

function updateLengthAvailability(lengthBlock: HTMLElement): void {
  lengthBlock.querySelectorAll<HTMLInputElement>('input[name="length"]').forEach((input) => {
    const disabled = Number(input.value) > state.base;
    input.disabled = disabled;
    input.closest('label.radio')?.classList.toggle('radio--disabled', disabled);
  });
}

function updatePosSecret(): void {
  const span = document.getElementById('possible-secret');
  if (!span) return;
  span.textContent = String(countPossibleSecrets(state.length, state.base));
}

function onLengthChange(e: Event): void {
  const target = e.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.type !== 'radio') return;

  const value = Number(target.value);
  if (!isLengthOfSecret(value)) return;

  state.length = value;
  updatePosSecret();
}

function onBaseChange(e: Event, lengthBlock: HTMLElement): void {
  const target = e.target;
  if (!(target instanceof HTMLInputElement)) return;

  state.base = Number(target.value) as baseOfSecret;
  updateLengthAvailability(lengthBlock);

  if (state.length > state.base) {
    state.length = 2;
    const first = lengthBlock.querySelector<HTMLInputElement>('input[name="length"][value="2"]');
    if (first) first.checked = true;
  }
  updatePosSecret();
}

export function renderMenu(onStart: () => void): HTMLElement {
  state.leaderBoard = loadLeaderboard();
  const menu = document.createElement('div');
  menu.className = 'menu';
  const title = document.createElement('h1');
  title.className = 'app__title';
  title.textContent = 'Bulls and Cows';
  menu.appendChild(title);

  const lengthBlock = document.createElement('div');
  lengthBlock.className = 'menu__input menu__input--length';
  lengthBlock.append(createTitle('SECRET NUMBER LENGTH'));
  LENGTHS.forEach((value) =>
    lengthBlock.appendChild(createRadio('length', value, String(value), value === state.length)),
  );
  lengthBlock.addEventListener('change', onLengthChange);

  const baseBlock = document.createElement('div');
  baseBlock.className = 'menu__input menu__input--base';
  baseBlock.append(createTitle('SECRET NUMBER BASE'));
  BASES.forEach(({ value, label }) =>
    baseBlock.appendChild(createRadio('base', value, label, value === state.base, 'radio--base')),
  );
  baseBlock.addEventListener('change', (e) => onBaseChange(e, lengthBlock));

  const desc = document.createElement('p');
  desc.className = 'menu__desc';
  desc.textContent = 'Possible secret for these settings: ';

  const possibleSpan = document.createElement('span');
  possibleSpan.id = 'possible-secret';
  possibleSpan.textContent = String(countPossibleSecrets(state.length, state.base));
  desc.appendChild(possibleSpan);

  const button = document.createElement('button');
  button.className = 'menu__btn';
  button.textContent = 'start';
  button.addEventListener('click', onStart);

  const leaderBoard = createLeaderboard(state.leaderBoard);

  menu.append(lengthBlock, baseBlock, desc, button, leaderBoard);
  return menu;
}
