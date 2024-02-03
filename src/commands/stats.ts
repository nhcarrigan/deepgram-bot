import {
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const stats: Command = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Generate a report on help threads.")
    .setDMPermission(false),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();

      const { member } = interaction;
      if (
        !member ||
        !(member instanceof GuildMember) ||
        (!bot.env.helperRoles.some((r) => member.roles.cache.has(r)) &&
          !member.permissions.has(PermissionFlagsBits.Administrator))
      ) {
        await interaction.editReply({
          content: "You do not have permission to use this.",
        });
        return;
      }

      let rawArchived = await bot.cache.helpChannel.threads.fetchArchived();
      const archived = rawArchived.threads;
      const active = (await bot.cache.helpChannel.threads.fetchActive())
        .threads;
      const threads = [...archived.map((e) => e), ...active.map((e) => e)];
      const sorted = threads
        .map((e) => e)
        .sort((a, b) => (b.createdTimestamp ?? 0) - (a.createdTimestamp ?? 0));
      let oldest = sorted.slice(-1)[0];

      while (rawArchived.hasMore) {
        rawArchived = await bot.cache.helpChannel.threads.fetchArchived({
          before: oldest.id,
        });
        sorted.push(...rawArchived.threads.map((e) => e));
        sorted.sort(
          (a, b) => (b.createdTimestamp ?? 0) - (a.createdTimestamp ?? 0)
        );
        oldest = sorted.slice(-1)[0];
      }

      const total = sorted.length;
      const answeredArray = sorted.filter((thread) =>
        thread.appliedTags.includes(bot.cache.answerTag)
      );
      const answered = answeredArray.length;
      const unanswered = sorted.filter(
        (thread) => !thread.appliedTags.includes(bot.cache.answerTag)
      ).length;
      const inactive = sorted.filter((thread) =>
        thread.appliedTags.includes(bot.cache.inactiveTag)
      ).length;
      const open = sorted.filter((thread) => !thread.archived).length;
      const closed = sorted.filter((thread) => thread.archived).length;
      const moved = sorted.filter(
        (thread) => thread.ownerId === bot.user?.id
      ).length;

      /* TODO: Original plan of checking based on updatedAt doesn't work because that doesn't exist for threads. */
      //   const averageTime = answeredArray.reduce((thread, sum) => {
      //     sum += (thread.)
      //   })

      await interaction.editReply({
        content: `# Help Channel Stats:
- Answered Threads: ${answered}
- Unanswered Threads: ${unanswered}
- Inactive Threads: ${inactive}
- Open Threads: ${open}
- Closed Threads: ${closed}
- Moved Threads: ${moved}
─────────────────────────
- Average time to answer: Coming soon?
- Total Threads: ${total}`,
      });
    } catch (err) {
      await errorHandler(bot, "stats command", err);
    }
  },
};
