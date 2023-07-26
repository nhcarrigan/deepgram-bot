import { assert } from "chai";
import { after } from "mocha";

import { validateEnv } from "../../src/utils/validateEnv";

suite("validateEnv utility", () => {
  test("throws an error on missing TOKEN", () => {
    assert.throws(validateEnv, "Missing TOKEN environment variable");
  });

  test("throws an error on missing HOME_GUILD_ID", () => {
    process.env.TOKEN = "discord bot token";
    assert.throws(validateEnv, "Missing HOME_GUILD_ID environment variable");
  });

  test("throws an error when missing helper roles", () => {
    process.env.HOME_GUILD_ID = "123";
    assert.throws(validateEnv, "Missing HELPER_ROLE_IDS environment variable");
  });

  test("throws an error when missing HELP_CHANNEL_ID", () => {
    process.env.HELPER_ROLE_IDS = "123,456,789";
    assert.throws(validateEnv, "Missing HELP_CHANNEL_ID environment variable");
  });

  test("throws an error when missing GENERAL_CHANNEL_ID", () => {
    process.env.HELP_CHANNEL_ID = "123";
    assert.throws(
      validateEnv,
      "Missing GENERAL_CHANNEL_ID environment variable"
    );
  });

  test("throws an error when missing STICKY_MESSAGE_FREQUENCY", () => {
    process.env.GENERAL_CHANNEL_ID = "123";
    assert.throws(
      validateEnv,
      "Missing STICKY_MESSAGE_FREQUENCY environment variable"
    );
  });

  test("throws an error when STICKY_MESSAGE_FREQUENCY is not a number", () => {
    process.env.STICKY_MESSAGE_FREQUENCY = "not a number";
    assert.throws(
      validateEnv,
      "Could not parse sticky message frequency into number"
    );
  });

  test("returns the environment cache when all variables are present", () => {
    process.env.STICKY_MESSAGE_FREQUENCY = "10";
    assert.deepEqual(validateEnv(), {
      token: "discord bot token",
      homeGuild: "123",
      helperRoles: ["123", "456", "789"],
      helpChannel: "123",
      generalChannel: "123",
      stickyFrequency: 10,
    });
  });

  after(() => {
    delete process.env.TOKEN;
  });
});
