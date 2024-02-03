import { REST, Routes } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Registers the loaded commands to Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const registerCommands = async (bot: ExtendedClient) => {
  try {
    if (!bot.user) {
      throw new Error("Bot is not logged in. Cannot register commands yet.");
    }
    const rest = new REST({ version: "10" }).setToken(bot.env.token);
    const commands = bot.commands.map((command) => command.data.toJSON());
    const contexts = bot.contexts.map((context) => context.data);

    await rest.put(
      Routes.applicationGuildCommands(bot.user.id, bot.env.homeGuild),
      { body: [...commands, ...contexts] }
    );
  } catch (err) {
    await errorHandler(bot, "register commands utility", err);
  }
};
