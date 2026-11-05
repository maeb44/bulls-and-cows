import type { baseOfSecret, lengthOfSecret } from '../types';
import { createDigitValidator } from './createDigitValidator';

export function isValidGuess(guess: string, length: lengthOfSecret, base: baseOfSecret) {
  if (guess.length !== length) return false;
  const unique = [...new Set(guess.toLowerCase())];
  if (guess.length !== unique.length) return false;
  const validator = createDigitValidator(base);
  for (const char of guess) {
    if (!validator(char)) return false;
  }

  return true;
}
