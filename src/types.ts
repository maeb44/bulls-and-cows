export const LENGTHS = [2, 3, 4, 5, 6] as const;
export type lengthOfSecret = (typeof LENGTHS)[number];

export function isLengthOfSecret(value: number): value is lengthOfSecret {
  return (LENGTHS as readonly number[]).includes(value);
}

export const BASES = [2, 8, 10, 16] as const;
export type baseOfSecret = (typeof BASES)[number];

export function isBaseOfSecret(value: number): value is baseOfSecret {
  return (BASES as readonly number[]).includes(value);
}
