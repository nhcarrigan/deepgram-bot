import { GuildMember, Interaction } from "discord.js";

import { ResponseText } from "../config/ResponseText";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { makeAiRequest } from "../modules/makeAiRequest";
import { parseQuestionContent } from "../modules/parseQuestionContent";
import { errorHandler } from "../utils/errorHandler";
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
  try {
    if (interaction.isChatInputCommand()) {
      const target = bot.commands.find(
        (c) => c.data.name === interaction.commandName
      );
      if (!target) {
        await interaction.editReply({
          content: ResponseText.NoCommand,
        });
        return;
      }
      await target.run(bot, interaction);
    }
    if (interaction.isContextMenuCommand()) {
      await interaction.deferReply({ ephemeral: true });
      if (!isGuildContextCommand(interaction)) {
        await interaction.editReply({
          content: ResponseText.NoGuild,
        });
        return;
      }
      const target = bot.contexts.find(
        (c) => c.data.name === interaction.commandName
      );
      if (!target) {
        await interaction.editReply({
          content: ResponseText.NoCommand,
        });
        return;
      }
      await target.run(bot, interaction);
    }

    if (interaction.isButton()) {
      await interaction.deferReply({ ephemeral: true });
      if (interaction.customId.startsWith("yes-")) {
        const questionAuthorId = interaction.customId.split("-")[1];
        const { member, message } = interaction;
        if (!member) {
          await interaction.editReply({
            content: ResponseText.MemberError,
          });
          return;
        }
        if (
          member.user.id !== questionAuthorId &&
          !bot.env.helperRoles.some((r) =>
            (member as GuildMember).roles.cache.has(r)
          )
        ) {
          await interaction.editReply({
            content: ResponseText.MustBeHelperOrAuthor,
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
          "confirm",
          parseQuestionContent(question?.content),
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
            content: ResponseText.MemberError,
          });
          return;
        }
        if (
          !bot.env.helperRoles.some((r) =>
            (member as GuildMember).roles.cache.has(r)
          )
        ) {
          await interaction.editReply({
            content: ResponseText.MustBeHelperButton,
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
          parseQuestionContent(question?.content),
          message.content
        );
        await interaction.editReply({
          content: response,
        });
      }
    }
  } catch (err) {
    await errorHandler(bot, "interaction create event", err);
    if ("editReply" in interaction) {
      await interaction.editReply({
        content: ResponseText.InteractionError,
      });
    }
  }
};
