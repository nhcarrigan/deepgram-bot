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
    /**
     * Fetch everything once on load so that we can parse mentions
     * in the answer command.
     */
    await homeGuild.members.fetch();
    await homeGuild.channels.fetch();
    await homeGuild.roles.fetch();
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
    const answerTag = helpChannel.availableTags.find(
      (t) => t.name === "Answered"
    );
    const inactiveTag = helpChannel.availableTags.find(
      (t) => t.name === "Inactive"
    );
    if (!questionTag) {
      throw new Error("Could not find `Question` tag.");
    }
    if (!answerTag) {
      throw new Error("Could not find `Answer` tag.");
    }
    if (!inactiveTag) {
      throw new Error("Could not find `Inactive` tag.");
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

    const modChannel =
      homeGuild.channels.cache.get(bot.env.modChannel) ||
      (await homeGuild.channels.fetch(bot.env.modChannel));
    if (!modChannel) {
      throw new Error("Could not find mod channel.");
    }
    if (!("send" in modChannel)) {
      throw new Error("Mod channel is not a text channel.");
    }
    if (!bot.cache) {
      bot.cache = {
        homeGuild,
        helpChannel,
        generalChannel,
        modChannel,
        questionTag: questionTag.id,
        answerTag: answerTag.id,
        inactiveTag: inactiveTag.id,
        lastSticky: "",
      };
    }
  } catch (err) {
    await errorHandler(bot, "load channels utility", err);
    // shut down because the cache is essential.
    process.exit(1);
  }
};
