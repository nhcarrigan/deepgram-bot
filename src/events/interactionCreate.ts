import { Interaction } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { isGuildContextCommand } from "../utils/typeGuards";

/**
 * Handles the logic for responding to interactions.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Interaction} interaction The interaction payload from Discord.
 */
export const interactionCreate = async (
  bot: ExtendedClient,
  interaction: Interaction
) => {
  if (interaction.isContextMenuCommand()) {
    await interaction.deferReply({ ephemeral: true });
    if (!isGuildContextCommand(interaction)) {
      await interaction.editReply({
        content: "This command can only be used in a server.",
      });
      return;
    }
    const target = bot.contexts.find(
      (c) => c.data.name === interaction.commandName
    );
    if (!target) {
      await interaction.editReply({
        content: "This command is not available.",
      });
      return;
    }
    await target.run(bot, interaction);
  }
};
