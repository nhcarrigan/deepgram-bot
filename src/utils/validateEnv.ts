import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Validates that all environment variables are present.
 *
 * @returns { ExtendedClient["env"] } The bot's environment cache.
 */
export const validateEnv = (): ExtendedClient["env"] => {
  if (!process.env.TOKEN) {
    throw new Error("Missing TOKEN environment variable");
  }
  return {
    token: process.env.TOKEN,
  };
};
