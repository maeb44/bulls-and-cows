import { createDigitValidator } from '../utils/createDigitValidator';

describe('createDigitValidator', () => {
  const HEXBase = 16;
  const correctChar = '1';
  const uncorrectChar = 'Y';
  const result = createDigitValidator(HEXBase);
  test('createDigitValidator возвращает функцию', () => {
    expect(typeof result).toBe('function');
  });
  test('Возвращаеммая функция возвращает boolean', () => {
    expect(typeof result(correctChar)).toBe('boolean');
  });
  test('Возвращаеммая функция вернёт true на символ входящий в base', () => {
    expect(result(correctChar)).toBe(true);
  });
  test('Возвращаеммая функция вернёт false на символ не входящий в base', () => {
    expect(result(uncorrectChar)).toBe(false);
  });
  test('base=16 принимает f', () => {
    expect(createDigitValidator(16)('f')).toBe(true);
  });

  test('base=10 отклоняет f', () => {
    expect(createDigitValidator(10)('f')).toBe(false);
  });
});
