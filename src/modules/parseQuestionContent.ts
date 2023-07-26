/**
 * Used to parse the question content and remove the header from the question post.
 *
 * @param {string} content The message content to parse.
 * @returns {string} The parsed message content.
 */
export const parseQuestionContent = (content?: string) => {
  return content ? content.split("\n").slice(1).join("\n").trim() : "";
};
