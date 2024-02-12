import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";
import { stripLinks } from "../../utils/stripLinks";

/**
 * Fetches the threads from the help channel, finds the three most recent threads without
 * the answered tag, posts a summary to the general channel.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const aggregateDailyUnansweredThreads = async (bot: ExtendedClient) => {
  try {
    const lastMessage = (
      await bot.cache.generalChannel.messages.fetch({
        limit: 1,
      })
    ).first();

    if (lastMessage?.author.id === bot.user?.id) {
      return;
    }
    const threads = (await bot.cache.helpChannel.threads.fetchActive()).threads;
    const unanswered = threads.filter(
      (thread) => !thread.appliedTags.includes(bot.cache.answerTag)
    );
    const firstThree = unanswered
      .map((e) => e)
      .sort((a, b) => (b.createdTimestamp ?? 0) - (a.createdTimestamp ?? 0))
      .slice(0, 3);

    await bot.cache.generalChannel.send({
      content: `Heya! It looks like some of your fellow community members might need some assistance.\n${firstThree
        .map((t) => `- [${stripLinks(t.name)}](<${t.url}>)`)
        .join("\n")}`,
    });
  } catch (err) {
    await errorHandler(bot, "aggregate daily unanswered threads", err);
  }
};
