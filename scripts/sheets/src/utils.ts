export type Raw<T> = Record<keyof T, string | null>;
export const c = <T>(sheet: string, range: string, map: (row: Raw<T>) => T) => {
  return {
    sheet,
    range,
    map,
  };
};
