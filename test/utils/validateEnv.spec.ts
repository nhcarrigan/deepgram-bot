import { assert } from "chai";
import { WebhookClient } from "discord.js";
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

  test("throws an error when missing DEBUG_HOOK", () => {
    process.env.STICKY_MESSAGE_FREQUENCY = "10";
    assert.throws(validateEnv, "Missing DEBUG_HOOK environment variable");
  });

  test("returns the environment cache when all variables are present", () => {
    process.env.DEBUG_HOOK =
      // This is not a live webhook URL, so don't bother trying to use it.
      "https://canary.discord.com/api/webhooks/1133857667505463326/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const result = validateEnv();
    assert.equal(result.token, "discord bot token");
    assert.equal(result.homeGuild, "123");
    assert.deepEqual(result.helperRoles, ["123", "456", "789"]);
    assert.equal(result.helpChannel, "123");
    assert.equal(result.generalChannel, "123");
    assert.equal(result.stickyFrequency, 10);
    assert.instanceOf(result.debugHook, WebhookClient);
  });

  after(() => {
    delete process.env.TOKEN;
    delete process.env.HOME_GUILD_ID;
    delete process.env.HELPER_ROLE_IDS;
    delete process.env.HELP_CHANNEL_ID;
    delete process.env.GENERAL_CHANNEL_ID;
    delete process.env.STICKY_MESSAGE_FREQUENCY;
    delete process.env.DEBUG_HOOK;
  });
});
