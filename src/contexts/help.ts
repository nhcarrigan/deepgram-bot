import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { Context } from "../interfaces/Context";

export const help: Context = {
  data: {
    name: "help",
    type: 3,
  },
  run: async (bot, interaction) => {
    const { member } = interaction;

    if (!bot.env.helperRoles.some((r) => member.roles.cache.has(r))) {
      await interaction.editReply({
        content: "This command can only be used by our server helpers.",
      });
      return;
    }

    const message = interaction.options.getMessage("message");
    if (!message) {
      await interaction.editReply({
        content: "Error loading message.",
      });
      return;
    }
    const { content, author } = message;
    await message.delete();
    const thread = await bot.cache.helpChannel.threads.create({
      name: `Help Requested by ${author.username}`,
      autoArchiveDuration: 1440,
      message: {
        content: `Hey <@!${author.id}>, your question has been moved here!\n\n${content}`,
      },
      appliedTags: [bot.cache.questionTag],
    });
    const yesButton = new ButtonBuilder()
      .setCustomId("yes")
      .setLabel("This helps!")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success);
    const noButton = new ButtonBuilder()
      .setCustomId("no")
      .setLabel("This is incorrect.")
      .setEmoji("✖️")
      .setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      yesButton,
      noButton
    );
    await thread.send({
      content: "This will eventually be an AI response.",
      components: [row],
    });
    await interaction.editReply({
      content: "The question has been moved to the help forum.",
    });
  },
};
