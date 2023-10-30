import { EmbedBuilder } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Formats an error and sends it to the debug hook.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {string} message A description of where in the code the error occurred.
 */
export const healthCheck = async (bot: ExtendedClient, message: string) => {
  // typecast
  const embed = new EmbedBuilder();
  embed.setTitle(`Health check!`);
  embed.setDescription(message);

  await bot.env.debugHook.send({ embeds: [embed] });
};
