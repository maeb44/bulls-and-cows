const memoize = (fn: (length: number, base: number) => number) => {
  const cache = new Map<string, number>();
  return (length: number, base: number) => {
    const stringifyObj = JSON.stringify({ length, base });
    const cached = cache.get(stringifyObj);
    if (cached !== undefined) return cached;

    const result = fn(length, base);
    cache.set(stringifyObj, result);
    return result;
  };
};
export const countPossibleSecrets = memoize((length, base) => {
  if (length > base) throw new Error('length cant be more than base');
  if (length === 0) return 1;

  return base * countPossibleSecrets(length - 1, base - 1);
});
