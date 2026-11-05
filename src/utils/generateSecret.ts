import type { baseOfSecret, lengthOfSecret } from '../types';

export function generateSecret(
  length: lengthOfSecret,
  base: baseOfSecret,
  random = Math.random,
): string[] {
  if (length > base) throw new Error('length is too high for select base');
  const digits = Array.from({ length: base }, (_, i) => i.toString(base));
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }

  return digits.slice(0, length);
}
