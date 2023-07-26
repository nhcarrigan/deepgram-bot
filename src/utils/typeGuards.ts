import { ContextMenuCommandInteraction } from "discord.js";

import { GuildContextCommand } from "../interfaces/GuildContextCommand";

/**
 * Validates that a context command was used within a guild.
 *
 * @param {ContextMenuCommandInteraction} context The interaction payload from Discord.
 * @returns {boolean} If the guild property is not null.
 */
export const isGuildContextCommand = (
  context: ContextMenuCommandInteraction
): context is GuildContextCommand => !!context.guild && !!context.member;
