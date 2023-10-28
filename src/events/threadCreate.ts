import { AnyThreadChannel, ChannelType } from "discord.js";

import { ResponseText } from "../config/ResponseText";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { sleep } from "../utils/sleep";

/**
 * Handles the thread create event.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {AnyThreadChannel} thread The thread channel payload from Discord.
 */
export const threadCreate = async (
  bot: ExtendedClient,
  thread: AnyThreadChannel
) => {
  try {
    /**
     * Currently we only care about posts in the help channel, so we can ignore everything else.
     * We also type assert to a guild thread for safety.
     */
    if (
      thread.parent?.id !== bot.cache.helpChannel.id ||
      thread.type !== ChannelType.PublicThread
    ) {
      return;
    }

    const isMovedPost = thread.ownerId === bot.user?.id;

    /**
     * We need to wait a bit here. Sometimes a thread create event transmits and is received
     * before the initial thread message is sent. This avoids errors from that race condition.
     */
    await sleep(1000);

    await thread.send({
      content: isMovedPost
        ? ResponseText.MovedThread
        : ResponseText.CreatedThread,
    });
  } catch (err) {
    await errorHandler(bot, "thread create", err);
  }
};
