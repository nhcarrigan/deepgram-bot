import { Message } from "discord.js";

/**
 * Formats a discussion post into Markdown syntax, cleaning the mentions
 * and including images and message links.
 * !This is currently configured for GitHub flavoured markdown.
 *
 * @param {Message} message The message payload from Discord.
 * @param {boolean} botPost If the post was created through the bot's help command.
 * @returns {string} A formatted message.
 */
export const formatDiscussionPost = (
  message: Message,
  botPost?: boolean
): string => {
  /**
   * The comment blocks are a trick to escape accidentally @-mentioning users.
   * Github does not support escaping the @-mention yet.
   *
   * Refer to https://github.com/github/markup/issues/1168 for more info.
   */
  const content = botPost
    ? message.cleanContent
        .replace(/@/g, "@<!-- -->")
        .split("your question has been moved here!\n\n")[1] ?? "Unknown Post"
    : message.cleanContent.replace(/@/g, "@<!-- -->");
  const images = message.attachments.map(
    (a) => `![${a.description ?? ""}](${a.url})`
  );
  const author = botPost
    ? message.mentions.users.first()?.username ?? "Unknown Author"
    : message.author.username;
  const url = message.url;

  return `${content}\n\n${images}\n\n> [Posted by ${author}](${url})`;
};
