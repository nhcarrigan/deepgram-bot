import { ExtendedClient } from "./ExtendedClient";
import { GuildContextCommand } from "./GuildContextCommand";

export interface Context {
  data: {
    name: string;
    type: 2 | 3;
  };
  /**
   * Handles the logic for a given context menu interaction.
   *
   * @param { ExtendedClient } bot The bot's Discord instance.
   * @param { GuildContextCommand } interaction The interaction payload from Discord.
   */
  run: (bot: ExtendedClient, interaction: GuildContextCommand) => Promise<void>;
}
