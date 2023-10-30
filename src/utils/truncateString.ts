/**
 * Helper function to truncate a string and return a shortened string
 * with ... At the end if it's longer than `number`..
 *
 * @param {string} string Text to truncate.
 * @param {number} number Max length.
 * @returns {string} Returns a truncated string.
 */
export const truncateString = (string: string, number: number): string => {
  if (string.length <= number) {
    return string;
  }

  return string.slice(0, number) + "...";
};
