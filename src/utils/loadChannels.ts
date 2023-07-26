import { ChannelType } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Loads the guild and channel IDs from the environment, fetches
 * the payloads from Discord, and mounts them to the bot cache to
 * avoid multiple API calls.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const loadChannels = async (bot: ExtendedClient) => {
  try {
    const homeGuild =
      bot.guilds.cache.get(bot.env.homeGuild) ||
      (await bot.guilds.fetch(bot.env.homeGuild));
    if (!homeGuild) {
      throw new Error("Could not find home guild.");
    }
    const helpChannel =
      homeGuild.channels.cache.get(bot.env.helpChannel) ||
      (await homeGuild.channels.fetch(bot.env.helpChannel));
    if (!helpChannel) {
      throw new Error("Could not find help channel.");
    }
    if (helpChannel.type !== ChannelType.GuildForum) {
      throw new Error("Help channel is not a guild forum channel.");
    }
    const questionTag = helpChannel.availableTags.find(
      (t) => t.name === "Question"
    );
    if (!questionTag) {
      throw new Error("Could not find `Question` tag.");
    }

    const generalChannel =
      homeGuild.channels.cache.get(bot.env.generalChannel) ||
      (await homeGuild.channels.fetch(bot.env.generalChannel));
    if (!generalChannel) {
      throw new Error("Could not find general channel.");
    }
    if (!("send" in generalChannel)) {
      throw new Error("General channel is not a text channel.");
    }
    if (!bot.cache) {
      bot.cache = {
        homeGuild,
        helpChannel,
        generalChannel,
        questionTag: questionTag.id,
        lastSticky: "",
      };
    }
  } catch (err) {
    await errorHandler(bot, "load channels utility", err);
    // shut down because the cache is essential.
    process.exit(1);
  }
};
