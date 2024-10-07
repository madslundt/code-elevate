export const trimEnd = (input: string, trimEndValue: string): string => {
  const endIndex = input.lastIndexOf(trimEndValue);
  if (endIndex !== -1) {
    return input.substring(0, endIndex);
  }
  return input;
};
