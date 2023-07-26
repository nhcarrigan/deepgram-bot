import { WebhookClient } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Validates that all environment variables are present.
 *
 * @returns { ExtendedClient["env"] } The bot's environment cache.
 */
export const validateEnv = (): ExtendedClient["env"] => {
  if (!process.env.TOKEN) {
    throw new Error("Missing TOKEN environment variable");
  }
  if (!process.env.HOME_GUILD_ID) {
    throw new Error("Missing HOME_GUILD_ID environment variable");
  }
  if (!process.env.HELPER_ROLE_IDS) {
    throw new Error("Missing HELPER_ROLE_IDS environment variable");
  }
  const helperRoles = process.env.HELPER_ROLE_IDS.split(",");
  if (!helperRoles.length) {
    throw new Error("Could not parse helper roles into array.");
  }
  if (!process.env.HELP_CHANNEL_ID) {
    throw new Error("Missing HELP_CHANNEL_ID environment variable");
  }
  if (!process.env.GENERAL_CHANNEL_ID) {
    throw new Error("Missing GENERAL_CHANNEL_ID environment variable");
  }
  if (!process.env.STICKY_MESSAGE_FREQUENCY) {
    throw new Error("Missing STICKY_MESSAGE_FREQUENCY environment variable");
  }
  const stickyFrequency = parseInt(process.env.STICKY_MESSAGE_FREQUENCY, 10);
  if (!stickyFrequency) {
    throw new Error("Could not parse sticky message frequency into number");
  }
  if (!process.env.DEBUG_HOOK) {
    throw new Error("Missing DEBUG_HOOK environment variable");
  }
  return {
    token: process.env.TOKEN,
    homeGuild: process.env.HOME_GUILD_ID,
    helperRoles,
    helpChannel: process.env.HELP_CHANNEL_ID,
    generalChannel: process.env.GENERAL_CHANNEL_ID,
    stickyFrequency,
    debugHook: new WebhookClient({
      url: process.env.DEBUG_HOOK,
    }),
  };
};
