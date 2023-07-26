import { Client, ForumChannel, Guild, GuildTextBasedChannel } from "discord.js";

export interface ExtendedClient extends Client {
  env: {
    token: string;
    homeGuild: string;
    helperRoles: string[];
    helpChannel: string;
    generalChannel: string;
    stickyFrequency: number;
  };
  cache: {
    homeGuild: Guild;
    helpChannel: ForumChannel;
    generalChannel: GuildTextBasedChannel;
  };
}
