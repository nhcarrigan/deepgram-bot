import { GatewayIntentBits } from "discord.js";

const { Guilds, GuildMessages, MessageContent } = GatewayIntentBits;

export const IntentOptions = [Guilds, GuildMessages, MessageContent];
