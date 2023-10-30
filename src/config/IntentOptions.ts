import { GatewayIntentBits } from "discord.js";

const { Guilds, GuildMessages, MessageContent, GuildMembers } =
  GatewayIntentBits;

export const IntentOptions = [
  Guilds,
  GuildMessages,
  MessageContent,
  /**
   * This one is necessary to load the member list once, and to keep
   * the member cache updated on join/leave, for the answer command.
   */
  GuildMembers,
];
