import { generateSecret } from '../utils/generateSecret';
import type { baseOfSecret, lengthOfSecret } from '../types';

const randomValue = 0.38;
const getRandomValue = () => randomValue;

describe('generateSecret', () => {
  const staticLength = 2;
  const binaryBase = 2;
  const eightBase = 8;
  const decimalBase = 10;
  const HEXBase = 16;
  const DIGITS = '0123456789abcdef';

  test('generateSecret возвращает массив', () => {
    const result = generateSecret(staticLength, binaryBase, getRandomValue);
    expect(Array.isArray(result)).toBe(true);
  });
  test('generateSecret возвращает массив заданной длины', () => {
    const arrayOfLength: lengthOfSecret[] = [2, 3, 4, 5, 6];
    arrayOfLength.forEach((e) => {
      expect(generateSecret(e, HEXBase, getRandomValue).length).toBe(e);
    });
  });
  test('generateSecret длина больше системы счисления возвращает ошибку', () => {
    const errorLength = 6;
    expect(() => generateSecret(errorLength, binaryBase, getRandomValue)).toThrow(
      'length is too high for select base',
    );
  });
  test('generateSecret создаёт массив букв соответствующих base', () => {
    const arrOfBase: baseOfSecret[] = [binaryBase, eightBase, decimalBase, HEXBase];
    arrOfBase.forEach((base) => {
      const allowedDigits = DIGITS.slice(0, base);
      const result = generateSecret(staticLength, base, getRandomValue);
      result.forEach((char) => {
        expect(allowedDigits).toContain(char);
      });
    });
  });
  test('generateSecret создаёт массив уникальных букв', () => {
    const result = generateSecret(6, decimalBase, getRandomValue);
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });
  test('generateSecret детерминирован при фиксированном random', () => {
    const a = generateSecret(4, decimalBase, () => 0.38);
    const b = generateSecret(4, decimalBase, () => 0.38);
    expect(a).toEqual(b);
  });
  test('base=10, length=4,seq = 0.38 должно соответствовать заданному значению', () => {
    const result = generateSecret(4, decimalBase, () => 0.38);
    expect(result).toEqual(['5', '0', '7', '4']);
  });
  test('base=10, length=4,seq = 0.5 должно соответствовать заданному значению', () => {
    const result = generateSecret(4, decimalBase, () => 0.5);
    expect(result).toEqual(['0', '9', '1', '7']);
  });
  test('base=10, length=4,seq = 0.99 должно соответствовать заданному значению', () => {
    const result = generateSecret(4, decimalBase, () => 0.99);
    expect(result).toEqual(['0', '1', '2', '3']);
  });
});
