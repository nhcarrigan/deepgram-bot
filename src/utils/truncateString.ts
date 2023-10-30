/**
 * Helper function to truncate a string and return a shortened string
 * with ... at the end if it's longer than `number`.
 *
 * @param {string} string Text to truncate
 * @param {number} number Max length
 * @returns {string}
 */
export const truncateString = (string: string, number: number): string => {
  if (string.length <= number) {
    return string;
  }

  return string.slice(0, number) + "...";
};
