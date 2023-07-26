import { ChannelType } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Loads the guild and channel IDs from the environment, fetches
 * the payloads from Discord, and mounts them to the bot cache to
 * avoid multiple API calls.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const loadChannels = async (bot: ExtendedClient) => {
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
    };
  }
};
