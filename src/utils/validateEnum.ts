export const isValidEnumValue = <T extends object>(
  enumObject: T,
  value: unknown,
): value is T[keyof T] => {
  return Object.values(enumObject).includes(value as T[keyof T]);
};