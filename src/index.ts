import { Client, Events } from "discord.js";

import { IntentOptions } from "./config/IntentOptions";
import { interactionCreate } from "./events/interactionCreate";
import { threadCreate } from "./events/threadCreate";
import { ExtendedClient } from "./interfaces/ExtendedClient";
import { sendStickyMessage } from "./modules/sendStickyMessage";
import { errorHandler } from "./utils/errorHandler";
import { loadChannels } from "./utils/loadChannels";
import { loadContexts } from "./utils/loadContexts";
import { logHandler } from "./utils/logHandler";
import { registerCommands } from "./utils/registerCommands";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  try {
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
      setInterval(
        async () => await sendStickyMessage(bot),
        bot.env.stickyFrequency * 1000 * 60
      );
    });

    bot.on(Events.ThreadCreate, async (thread) => {
      await threadCreate(bot, thread);
    });

    await bot.login(bot.env.token);
  } catch (err) {
    const bot = new Client({ intents: IntentOptions }) as ExtendedClient;
    bot.env = validateEnv();
    await errorHandler(bot, "entry file", err);
  }
})();
