import { countPossibleSecrets } from '../utils/countPossibleSecrets';

describe('countPossibleSecrets — вычисление', () => {
  test('length=0 возвращает 1 (пустой секрет)', () => {
    expect(countPossibleSecrets(0, 4)).toBe(1);
  });

  test('length=1 возвращает base', () => {
    expect(countPossibleSecrets(1, 4)).toBe(4);
  });

  test('length=2, base=4 возвращает 12 (4×3)', () => {
    expect(countPossibleSecrets(2, 4)).toBe(12);
  });

  test('length=base возвращает base! (перестановка всех)', () => {
    expect(countPossibleSecrets(4, 4)).toBe(24);
    expect(countPossibleSecrets(6, 6)).toBe(720);
  });

  test('length=6, base=10 возвращает 151200', () => {
    expect(countPossibleSecrets(6, 10)).toBe(151200);
  });

  test('length=6, base=16 возвращает 5765760', () => {
    expect(countPossibleSecrets(6, 16)).toBe(5765760);
  });

  test('length > base бросает ошибку', () => {
    expect(() => countPossibleSecrets(5, 4)).toThrow('length cant be more than base');
  });
});
