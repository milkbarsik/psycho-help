// Бэк написан небрежно: в любом поле может прийти null/undefined, не тот тип
// или мусор. Эти помощники приводят значение к ожидаемому типу, чтобы UI не падал.

// Число: настоящее число или числовая строка ("10"), иначе null.
export const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

// Строка: непустая строка без крайних пробелов (или число строкой), иначе null.
export const toText = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return null;
};

// Массив: всегда массив, без null/undefined-элементов внутри.
export const asArray = <T>(value: T[] | null | undefined): NonNullable<T>[] =>
  Array.isArray(value) ? value.filter((item): item is NonNullable<T> => item != null) : [];
