import { ResponseText } from "../config/ResponseText";
import { Context } from "../interfaces/Context";
import { postGithubDiscussion } from "../modules/postGithubDiscussion";
import { errorHandler } from "../utils/errorHandler";

export const answer: Context = {
  data: {
    name: "answer",
    type: 3,
  },
  run: async (bot, interaction) => {
    try {
      const { member, channel } = interaction;

      if (!bot.env.helperRoles.some((r) => member.roles.cache.has(r))) {
        await interaction.editReply({
          content: ResponseText.MustBeHelper,
        });
        return;
      }

      const message = interaction.options.getMessage("message", true);
      if (!message) {
        await interaction.editReply({
          content: ResponseText.NoMessage,
        });
        return;
      }

      if (!channel) {
        await interaction.editReply({
          content: ResponseText.NoChannel,
        });
        return;
      }

      if (
        !channel.isThread() ||
        channel.parent?.id !== bot.cache.helpChannel.id
      ) {
        await interaction.editReply({
          content: ResponseText.MustBeHelpChannel,
        });
        return;
      }

      if (channel.appliedTags.includes(bot.cache.answerTag)) {
        await interaction.editReply({
          content: ResponseText.AlreadyAnswered,
        });
        return;
      }

      await channel.setAppliedTags([
        ...channel.appliedTags,
        bot.cache.answerTag,
      ]);
      const originalPost = await channel.fetchStarterMessage();
      if (!originalPost) {
        await interaction.editReply({
          content: ResponseText.NoOP,
        });
        return;
      }
      const originalPostContent =
        originalPost.author.id === bot.user?.id
          ? originalPost.content.split(
              "your question has been moved here!\n\n"
            )[1] ?? "Unknown Post"
          : originalPost.content;
      const originalPostAuthor =
        originalPost.author.id === bot.user?.id
          ? originalPost.mentions.users.first()?.username ?? "Unknown Author"
          : originalPost.author.username;

      const posted = await postGithubDiscussion(
        bot,
        channel.name,
        {
          content: originalPostContent,
          author: originalPostAuthor,
        },
        {
          content: message.content,
          author: message.author.username,
        }
      );

      await interaction.editReply({
        content: posted
          ? ResponseText.AnswerSuccess
          : ResponseText.AnswerFailed,
      });
    } catch (err) {
      await errorHandler(bot, "help context", err);
      await interaction.editReply({
        content: ResponseText.InteractionError,
      });
    }
  },
};
