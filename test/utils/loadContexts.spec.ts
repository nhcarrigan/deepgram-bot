import { readdir } from "fs/promises";
import { join } from "path";

import { assert } from "chai";

import { Context } from "../../src/interfaces/Context";
import { ExtendedClient } from "../../src/interfaces/ExtendedClient";
import { loadContexts } from "../../src/utils/loadContexts";

suite("loadContexts util", () => {
  test("loads the expected files", async () => {
    const result: { contexts: Context[] } = { contexts: [] };
    await loadContexts(result as ExtendedClient);
    const fileList = await readdir(
      join(process.cwd(), "prod", "contexts"),
      "utf-8"
    );
    assert.equal(result.contexts.length, fileList.length);
    for (const file of fileList) {
      const name = file.split(".")[0];
      assert.exists(
        result.contexts.find((context) => context.data.name === name),
        `${name} command was not loaded.`
      );
    }
  });
});
