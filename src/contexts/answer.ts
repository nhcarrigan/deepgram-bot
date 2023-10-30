import { ResponseText } from "../config/ResponseText";
import { Context } from "../interfaces/Context";
import { formatDiscussionPost } from "../modules/formatDiscussionPost";
import { postGithubDiscussion } from "../modules/postGithubDiscussion";
import { errorHandler } from "../utils/errorHandler";

export const answer: Context = {
  data: {
    name: "Accept answer",
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
      const originalPostContent = formatDiscussionPost(
        originalPost,
        originalPost.author.id === bot.user?.id
      );
      const answerPostContent = formatDiscussionPost(message, false);

      const posted = await postGithubDiscussion(
        bot,
        channel.name,
        originalPostContent,
        answerPostContent
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
