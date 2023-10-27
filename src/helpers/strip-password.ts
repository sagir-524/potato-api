export const stripPassword = <
  T extends { password: string },
  R extends Omit<T, "password">
>(
  data: T
): R => {
  const newData: R = { ...data, password: undefined };
  return newData;
};
