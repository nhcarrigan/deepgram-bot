import { StickyMessage } from "../config/ResponseText";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Sends the sticky message to the general channel, deleting the old one
 * if cached and still found.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const sendStickyMessage = async (bot: ExtendedClient) => {
  try {
    const lastMessage = (
      await bot.cache.generalChannel.messages.fetch({
        limit: 1,
      })
    ).first();
    if (!lastMessage) {
      return;
    }
    const { author } = lastMessage;
    if (author.id === bot.user?.id) {
      return;
    }

    if (bot.cache.lastSticky) {
      const lastSticky = await bot.cache.generalChannel.messages.fetch(
        bot.cache.lastSticky
      );
      if (lastSticky) {
        await lastSticky.delete();
      }
    }

    const sent = await bot.cache.generalChannel.send({
      content: StickyMessage,
    });
    if (bot.cache.lastSticky !== sent.id) {
      bot.cache.lastSticky = sent.id;
    }
  } catch (err) {
    await errorHandler(bot, "send sticky message module", err);
  }
};
