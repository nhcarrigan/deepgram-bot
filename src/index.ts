import { Client, Events } from "discord.js";
import { scheduleJob } from "node-schedule";

import { IntentOptions } from "./config/IntentOptions";
import { interactionCreate } from "./events/interactionCreate";
import { threadCreate } from "./events/threadCreate";
import { ExtendedClient } from "./interfaces/ExtendedClient";
import { sendStickyMessage } from "./modules/sendStickyMessage";
import { aggregateDailyUnansweredThreads } from "./modules/threads/aggregateDailyUnansweredThreads";
import { aggregateUnansweredThreads } from "./modules/threads/aggregateUnansweredThreads";
import { aggregateWeeklyThreads } from "./modules/threads/aggregateWeeklyThreads";
import { errorHandler } from "./utils/errorHandler";
import { healthCheck } from "./utils/healthCheck";
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
        async () => await healthCheck(bot, "Bot healthy."),
        1440 * 1000 * 60
      );

      setInterval(
        async () => await sendStickyMessage(bot),
        bot.env.stickyFrequency * 1000 * 60
      );

      scheduleJob("0 9 * * *", async () => {
        await aggregateDailyUnansweredThreads(bot);
      });

      scheduleJob("0 10 * * *", async () => {
        await aggregateUnansweredThreads(bot);
      });

      scheduleJob("0 7 * * 1", async () => {
        await aggregateWeeklyThreads(bot);
      });
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
