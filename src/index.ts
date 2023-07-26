import { Client, Events } from "discord.js";

import { IntentOptions } from "./config/IntentOptions";
import { interactionCreate } from "./events/interactionCreate";
import { ExtendedClient } from "./interfaces/ExtendedClient";
import { loadChannels } from "./utils/loadChannels";
import { loadContexts } from "./utils/loadContexts";
import { logHandler } from "./utils/logHandler";
import { registerCommands } from "./utils/registerCommands";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  const bot = new Client({ intents: IntentOptions }) as ExtendedClient;
  bot.env = validateEnv();
  await loadContexts(bot);

  bot.on(Events.InteractionCreate, async (interaction) => {
    await interactionCreate(bot, interaction);
  });

  bot.on(Events.ClientReady, async () => {
    await loadChannels(bot);
    await registerCommands(bot);
    logHandler.log("info", "Bot is ready.");
  });

  await bot.login(bot.env.token);
})();
