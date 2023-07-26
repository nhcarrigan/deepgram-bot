import { assert } from "chai";

import { validateEnv } from "../../src/utils/validateEnv";

suite("validateEnv utility", () => {
  test("throws an error on missing TOKEN", () => {
    assert.throws(validateEnv, "Missing TOKEN environment variable.");
  });

  test("returns the environment cache when all variables are present", () => {
    process.env.TOKEN = "discord bot token";
    assert.deepEqual(validateEnv(), { token: "discord bot token" });
  });

  after(() => {
    delete process.env.TOKEN;
  });
});
