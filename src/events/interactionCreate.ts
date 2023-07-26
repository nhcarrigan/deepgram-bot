import { GuildMember, Interaction } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { makeAiRequest } from "../modules/makeAiRequest";
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

  if (interaction.isButton()) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.customId === "yes") {
      const { message } = interaction;
      await message.edit({ components: [] });
      const messageHistory = await message.channel.messages.fetch({
        before: message.id,
        limit: 50,
      });
      const question = messageHistory.last();
      const response = await makeAiRequest(
        bot,
        "confirm",
        question?.content || "",
        message.content
      );
      await interaction.editReply({
        content: response,
      });
    }

    if (interaction.customId === "no") {
      const { member: member, message } = interaction;
      if (!member) {
        await interaction.editReply({
          content:
            "There was an error loading your user record. Please try again later.",
        });
        return;
      }
      if (
        !bot.env.helperRoles.some((r) =>
          (member as GuildMember).roles.cache.has(r)
        )
      ) {
        await interaction.editReply({
          content: "Only server helpers can mark a message as inaccurate.",
        });
        return;
      }
      await message.edit({ components: [] });
      const messageHistory = await message.channel.messages.fetch({
        before: message.id,
        limit: 50,
      });
      const question = messageHistory.last();
      const response = await makeAiRequest(
        bot,
        "deny",
        question?.content || "",
        message.content
      );
      await interaction.editReply({
        content: response,
      });
    }
  }
};
