import type { baseOfSecret } from '../types';

export function createDigitValidator(base: baseOfSecret) {
  return (char: string) => {
    const normalizeChar = char.toLowerCase();
    return !Number.isNaN(parseInt(normalizeChar, base));
  };
}
