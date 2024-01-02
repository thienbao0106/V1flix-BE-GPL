export const formatString = (str: string): string => {
  const lowerStr = str.toLowerCase();
  return `${lowerStr.charAt(0).toUpperCase()}${lowerStr.slice(1)}`;
};
