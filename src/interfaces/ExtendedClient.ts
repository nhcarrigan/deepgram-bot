import { Client } from "discord.js";

export interface ExtendedClient extends Client {
  env: {
    token: string;
  };
}
