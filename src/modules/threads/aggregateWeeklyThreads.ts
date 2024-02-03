import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Fetches the threads from the help channel, finds answered threads within the last week,
 * posts a list in the mod channel.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const aggregateWeeklyThreads = async (bot: ExtendedClient) => {
  try {
    const archived = (await bot.cache.helpChannel.threads.fetchArchived())
      .threads;
    const active = (await bot.cache.helpChannel.threads.fetchActive()).threads;
    const threads = [...archived.map((e) => e), ...active.map((e) => e)];
    const answered = threads
      .filter((thread) => thread.appliedTags.includes(bot.cache.answerTag))
      .map((e) => e)
      .sort((a, b) => (b.createdTimestamp ?? 0) - (a.createdTimestamp ?? 0));
    let oldest = answered.slice(-1)[0];

    while (
      oldest.createdTimestamp &&
      oldest.createdTimestamp > Date.now() - 1000 * 60 * 60 * 24 * 7
    ) {
      const archived = (
        await bot.cache.helpChannel.threads.fetchArchived({ before: oldest.id })
      ).threads;
      answered.push(
        ...archived
          .map((e) => e)
          .filter((thread) => thread.appliedTags.includes(bot.cache.answerTag))
      );
      answered.sort(
        (a, b) => (b.createdTimestamp ?? 0) - (a.createdTimestamp ?? 0)
      );
      oldest = answered.slice(-1)[0];
    }

    const filtered = answered
      .filter(
        (t) => (t.createdTimestamp ?? 0) >= Date.now() - 1000 * 60 * 60 * 24 * 7
      )
      .map((t) => `- [${t.name}](<${t.url}>)`);

    await bot.cache.modChannel.send({
      content: `Here's a recap of the threads that have been answered this week.\n${filtered
        .splice(0, 5)
        .join("\n")}`,
    });

    while (filtered.length > 0) {
      await bot.cache.modChannel.send({
        content: filtered.splice(0, 5).join("\n"),
      });
    }
  } catch (err) {
    await errorHandler(bot, "aggregate daily unanswered threads", err);
  }
};
