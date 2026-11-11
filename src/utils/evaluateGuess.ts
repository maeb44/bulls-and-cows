//предполагается что secret и guess содержат уникальные символы

export function evaluateGuess(secret: string[], guess: string) {
  const arrOfGuess = guess.toLocaleLowerCase().split('');
  const result = secret.reduce(
    (acc, e, index) => {
      if (e === arrOfGuess[index]) acc.bulls++;
      else if (e !== arrOfGuess[index] && arrOfGuess.includes(e)) acc.cows++;
      return acc;
    },
    {
      bulls: 0,
      cows: 0,
    },
  );
  return result;
}
