import { ContextMenuCommandInteraction, Guild } from "discord.js";

export interface GuildContextCommand extends ContextMenuCommandInteraction {
  guild: Guild;
}
