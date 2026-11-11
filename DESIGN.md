# DESIGN

## 1. Структуры данных и алгоритмы

### 1.1. generateSecret(length, base, random = Math.random)

Создаёт массив всех цифр системы (`Array.from({ length: base }, (_, i) => i.toString(base))`),
перемешивает его алгоритмом Fisher–Yates (проход с конца, обмен с `j = floor(random() * (i + 1))`),
возвращает первые `length` элементов через `slice`. При `length > base` бросает ошибку.
Источник случайности — параметр `random`, по умолчанию `Math.random`.

### 1.2. evaluateGuess(secret, guess)

Нормализует регистр (`guess.toLowerCase().split('')`), затем через `reduce` по `secret`
с аккумулятором `{ bulls, cows }`: если символ на своей позиции — `bulls++`,
иначе если символ есть в `guess` — `cows++`. Предполагается, что `secret` и `guess`
содержат уникальные символы.

### 1.3. isValidGuess(guess, length, base)

Проверяет длину (`guess.length !== length`), уникальность без учёта регистра
(`new Set(guess.toLowerCase()).size !== guess.length`) и допустимость каждого символа
через `createDigitValidator(base)`. Возвращает `boolean`.

### 1.4. createDigitValidator(base)

Каррированная фабрика: принимает `base`, возвращает предикат `(char) => boolean`.
Внутри нормализует символ (`char.toLowerCase()`) и проверяет через `parseInt(normalized, base)`
на `NaN`. Используется в `isValidGuess` и в фильтрации ввода в `renderGame.onInput`.

### 1.5. countPossibleSecrets(length, base)

Считает `P(base, length) = base! / (base − length)!` рекурсивно:
`base * countPossibleSecrets(length − 1, base − 1)`, база — `length === 0 → 1`,
при `length > base` бросает ошибку. Обёрнута в `memoize`, который кэширует результаты
в `Map` по ключу `JSON.stringify({ length, base })`. Рекурсия идёт через
мемоизированную версию, поэтому промежуточные значения тоже кэшируются.

## 2. Big O

### 2.1. generateSecret

- Время: **O(base)** — создание массива цифр O(base), shuffle O(base), slice O(length). Итого O(base).
- Память: **O(base)** — массив всех цифр системы.
- Обоснование: доминирует shuffle по всему массиву длины `base`, независимо от `length`.

### 2.2. evaluateGuess

- Время: **O(n²)**, где n = length. `reduce` по `secret` — O(n), внутри `includes` по `guess` — O(n). Итого O(n²).
- Память: **O(n)** — массив `arrOfGuess`.
- Обоснование: `includes` вызывается для каждого символа, не являющегося быком.
  Для n ≤ 6 (максимум 36 операций) это несущественно, поэтому оптимизация через `Set` не требуется.

### 2.3. isValidGuess

- Время: **O(n)**, где n = length. Один проход по строке, `Set` — O(n), `validator` — O(1) на символ.
- Память: **O(n)** — `Set` уникальных символов.
- Обоснование: каждый символ проверяется ровно один раз, `parseInt` по одному символу — константа.

### 2.4. countPossibleSecrets

- Время: **O(length)** при первом вызове (length рекурсивных шагов, каждый O(1) на `Map`),
  **O(1)** при повторном вызове с теми же аргументами (попадание в кэш).
- Память: **O(length)** — length записей в `Map` для промежуточных результатов.
- Обоснование: рекурсия уменьшает `length` на 1 каждый шаг, глубина — `length`.
  Мемоизация убирает повторные вычисления при совпадающих `(length, base)`.

## 3. Принципы чистого кода

| №   | Принцип                                 | Где применён                                                                                                                                                       |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Чистые функции без DOM и классов        | `generateSecret`, `evaluateGuess`, `isValidGuess`, `createDigitValidator`, `countPossibleSecrets` — все в `src/utils/`, не обращаются к DOM, не мутируют аргументы |
| 2   | Инъекция зависимости                    | `generateSecret(length, base, random)` — `random` параметром, тесты передают `() => 0.38` для детерминированности                                                  |
| 3   | Каррирование                            | `createDigitValidator(base)` возвращает `(char) => boolean`; используется в `isValidGuess` и в `renderGame.onInput` (два места)                                    |
| 4   | Мемоизация                              | `memoize(fn)` — обёртка с `Map`-кэшем, применена к `countPossibleSecrets`; рекурсия внутри идёт через мемоизированную версию                                       |
| 5   | Иммутабельность                         | `generateSecret` возвращает новый массив, не меняет входные данные; `evaluateGuess` не мутирует `secret`/`guess`                                                   |
| 6   | Методы массивов вместо ручных счётчиков | `evaluateGuess` реализован через `reduce` с аккумулятором `{ bulls, cows }`, а не через `for` с `bulls++`/`cows++`                                                 |
| 7   | Разделение слоёв                        | Чистая логика в `src/utils/`, DOM-слой в `src/components/menu/`; компоненты вызывают чистые функции                                                                |
