import { Client, Events } from "discord.js";

import { IntentOptions } from "./config/IntentOptions";
import { ExtendedClient } from "./interfaces/ExtendedClient";
import { loadChannels } from "./utils/loadChannels";
import { logHandler } from "./utils/logHandler";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  const bot = new Client({ intents: IntentOptions }) as ExtendedClient;
  bot.env = validateEnv();

  bot.on(Events.ClientReady, async () => {
    await loadChannels(bot);
    logHandler.log("info", "Bot is ready.");
  });

  await bot.login(bot.env.token);
})();
