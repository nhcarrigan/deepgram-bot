import { readdir } from "fs/promises";
import { join } from "path";

import { Command } from "../interfaces/Command";
import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Dynamically reads the `commands` directory and imports the files. Mounts
 * the commands to the bot to be used elsewhere.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const loadCommands = async (bot: ExtendedClient) => {
  try {
    const result: Command[] = [];
    const files = await readdir(
      join(process.cwd(), "prod", "commands"),
      "utf-8"
    );
    for (const file of files) {
      const name = file.split(".")[0];
      if (!name) {
        continue;
      }
      const mod = await import(join(process.cwd(), "prod", "commands", file));
      result.push(mod[name] as Command);
    }
    bot.commands = result;
  } catch (err) {
    await errorHandler(bot, "load commands utility", err);
  }
};
