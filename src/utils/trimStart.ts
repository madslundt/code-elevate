export const trimStart = (input: string, trimStartValue: string): string => {
  const startIndex = input.indexOf(trimStartValue);
  if (startIndex !== -1) {
    return input.substring(startIndex + trimStartValue.length);
  }
  return input;
};
