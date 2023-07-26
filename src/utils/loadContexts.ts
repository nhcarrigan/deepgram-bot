import { readdir } from "fs/promises";
import { join } from "path";

import { Context } from "../interfaces/Context";
import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Dynamically reads the `contexts` directory and imports the files. Mounts
 * the commands to the bot to be used elsewhere.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const loadContexts = async (bot: ExtendedClient) => {
  const result: Context[] = [];
  const files = await readdir(join(process.cwd(), "prod", "contexts"), "utf-8");
  for (const file of files) {
    const name = file.split(".")[0];
    const mod = await import(join(process.cwd(), "prod", "contexts", file));
    result.push(mod[name] as Context);
  }
  bot.contexts = result;
};
