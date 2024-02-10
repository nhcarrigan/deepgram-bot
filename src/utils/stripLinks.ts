/**
 * Utility to strip markdown links out of a string.
 *
 * @param {string} text The string to strip.
 * @returns {string} The string, without links.
 */
export const stripLinks = (text: string): string =>
  text.replace(/\[(.*?)\]\(.*?\)/g, "$1");
