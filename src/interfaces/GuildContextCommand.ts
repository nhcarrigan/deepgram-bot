import { ContextMenuCommandInteraction, Guild, GuildMember } from "discord.js";

export interface GuildContextCommand extends ContextMenuCommandInteraction {
  guild: Guild;
  member: GuildMember;
}
