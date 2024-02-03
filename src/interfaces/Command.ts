import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { ExtendedClient } from "./ExtendedClient";

export interface Command {
  data: SlashCommandBuilder;
  run: (
    bot: ExtendedClient,
    interaction: ChatInputCommandInteraction
  ) => Promise<void>;
}
