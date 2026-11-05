import { state } from '../state';

const LENGTHS = [1, 2, 3, 4, 5, 6];
const BASES = [
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
  extraClass = '',
): HTMLLabelElement {
  const labelEl = document.createElement('label');
  labelEl.className = `radio ${extraClass}`.trim();

  const input = document.createElement('input');
  input.type = 'radio';
  input.name = name;
  input.value = String(value);

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

function onLengthChange(e: Event): void {
  const target = e.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.type !== 'radio') return;
  state.length = Number(target.value);
}

function onBaseChange(e: Event, lengthBlock: HTMLElement): void {
  const target = e.target;
  if (!(target instanceof HTMLInputElement)) return;

  state.base = Number(target.value);
  updateLengthAvailability(lengthBlock);

  if (state.length > state.base) {
    state.length = 2;
    const first = lengthBlock.querySelector<HTMLInputElement>('input[name="length"][value="2"]');
    if (first) first.checked = true;
  }
}

export function renderMenu(): HTMLElement {
  const menu = document.createElement('div');
  menu.className = 'menu';

  const lengthBlock = document.createElement('div');
  lengthBlock.className = 'menu__input menu__input--length';
  lengthBlock.append(createTitle('SECRET NUMBER LENGTH'));
  LENGTHS.forEach((value) => lengthBlock.appendChild(createRadio('length', value, String(value))));
  lengthBlock.addEventListener('change', onLengthChange);

  const baseBlock = document.createElement('div');
  baseBlock.className = 'menu__input menu__input--base';
  baseBlock.append(createTitle('SECRET NUMBER BASE'));
  BASES.forEach(({ value, label }) =>
    baseBlock.appendChild(createRadio('base', value, label, 'radio--base')),
  );
  baseBlock.addEventListener('change', (e) => onBaseChange(e, lengthBlock));

  const desc = document.createElement('p');
  desc.className = 'menu__desc';
  desc.textContent = 'Possible secret for these settings:';
  const possibleSpan = document.createElement('span');
  possibleSpan.id = 'possible-secret';
  desc.appendChild(possibleSpan);

  const button = document.createElement('button');
  button.className = 'menu__btn';
  button.textContent = 'start';

  menu.append(lengthBlock, baseBlock, desc, button);
  return menu;
}
