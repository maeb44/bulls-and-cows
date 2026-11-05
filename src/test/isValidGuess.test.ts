import { isValidGuess } from '../utils/isValidGuess';

describe('isValidGuess', () => {
  const maxLength = 6;
  const HEXBase = 16;
  const decimalBase = 10;
  const correctGuess = '012efa';
  const uncorrectGuess = ' ';
  test('isValidGuess возвращает boolean', () => {
    const result = isValidGuess(correctGuess, maxLength, HEXBase);
    expect(typeof result).toBe('boolean');
  });
  test('isValidGuess возвращает false на guess !== length', () => {
    expect(isValidGuess(uncorrectGuess, maxLength, HEXBase)).toBe(false);
  });
  test('isValidGuess возвращает false если строка содержит символы не входящие в base', () => {
    const wrongChars = '02jp)l';
    expect(isValidGuess(wrongChars, maxLength, HEXBase)).toBe(false);
  });
  test('isValidGuess возвращает false если строка содержит не уникальные', () => {
    const wrongChars = '112233';
    expect(isValidGuess(wrongChars, maxLength, HEXBase)).toBe(false);
  });
  test('isValidGuess возвращает true на правилную строку', () => {
    const result = isValidGuess(correctGuess, maxLength, HEXBase);
    expect(result).toBe(true);
  });
  test('isValidGuess возвращает false для дубликатов с разным регистром', () => {
    expect(isValidGuess('aAbBcC', maxLength, 16)).toBe(false);
  });
  test('isValidGuess принимает заглавные A-F (регистр не важен)', () => {
    expect(isValidGuess('ABCDEF', maxLength, 16)).toBe(true);
  });

  test('isValidGuess принимает смешанный регистр без дубликатов', () => {
    expect(isValidGuess('aBcDeF', maxLength, 16)).toBe(true);
  });
  test('отклоняет буквы для base=10', () => {
    expect(isValidGuess('012efa', maxLength, decimalBase)).toBe(false);
  });
});
