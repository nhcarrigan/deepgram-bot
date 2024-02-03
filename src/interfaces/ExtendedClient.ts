import {
  Client,
  ForumChannel,
  Guild,
  GuildTextBasedChannel,
  WebhookClient,
} from "discord.js";

import { Command } from "./Command";
import { Context } from "./Context";

export interface ExtendedClient extends Client {
  env: {
    token: string;
    homeGuild: string;
    helperRoles: string[];
    helpChannel: string;
    generalChannel: string;
    modChannel: string;
    stickyFrequency: number;
    debugHook: WebhookClient;
  };
  cache: {
    homeGuild: Guild;
    helpChannel: ForumChannel;
    generalChannel: GuildTextBasedChannel;
    modChannel: GuildTextBasedChannel;
    questionTag: string;
    answerTag: string;
    inactiveTag: string;
    lastSticky: string;
  };
  contexts: Context[];
  commands: Command[];
}
