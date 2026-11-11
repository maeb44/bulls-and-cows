import { evaluateGuess } from '../utils/evaluateGuess';

describe('evaluateGuess', () => {
  const secretString = ['1', '2', '3', 'e', 'f', '0'];
  const guess = '137ef9';
  test('evaluateGuess возвращает объект', () => {
    const result = evaluateGuess(secretString, guess);
    expect(typeof result).toBe('object');
  });
  test('evaluateGuess возвращает объект с переменными bulls cows типа number', () => {
    const result = evaluateGuess(secretString, guess);
    expect(result).toEqual({
      bulls: expect.any(Number),
      cows: expect.any(Number),
    });
  });
  test('evaluateGuess возвращает все быки', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  test('evaluateGuess возвращает все коровы', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  test('смешанный случай', () => {
    expect(evaluateGuess(secretString, guess)).toEqual({ bulls: 3, cows: 1 });
  });
});
