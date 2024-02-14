import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Fetches the threads from the help channel, finds unanswered threads, posts a response to
 * threads that have not received a message in 7 days, or in 14 days.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const autorespondToThreads = async (bot: ExtendedClient) => {
  try {
    const archived = (
      await bot.cache.helpChannel.threads.fetchArchived({ fetchAll: true })
    ).threads;
    const active = (await bot.cache.helpChannel.threads.fetchActive()).threads;
    const threads = [...archived.map((e) => e), ...active.map((e) => e)];
    const unanswered = threads
      .filter((thread) => !thread.appliedTags.includes(bot.cache.answerTag))
      .map((e) => e)
      .sort((a, b) => (b.createdTimestamp ?? 0) - (a.createdTimestamp ?? 0));

    for (const thread of unanswered) {
      const lastMessage = (await thread.messages.fetch({ limit: 1 })).first();
      const owner = await thread.fetchOwner();
      if (!lastMessage || !owner) {
        continue;
      }
      if (lastMessage.author.id === owner.id) {
        continue;
      }
      if (
        lastMessage.createdTimestamp > Date.now() - 1000 * 60 * 60 * 24 * 8 &&
        lastMessage.createdTimestamp < Date.now() - 1000 * 60 * 60 * 24 * 7
      ) {
        await thread.send({
          content: `Hey there <@!${owner.id}>~! Did you forget about this thread? Let us know if you still need help!`,
        });
      }
      if (
        lastMessage.createdTimestamp > Date.now() - 1000 * 60 * 60 * 24 * 15 &&
        lastMessage.createdTimestamp < Date.now() - 1000 * 60 * 60 * 24 * 14
      ) {
        await thread.setAppliedTags([
          ...thread.appliedTags,
          bot.cache.inactiveTag,
        ]);
      }
    }
  } catch (err) {
    await errorHandler(bot, "autorespond to threads", err);
  }
};
