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
      const imported = await import(
        join(process.cwd(), "prod", "contexts", file)
      );
      const name = file.split(".")[0];
      const context = imported[name] as Context;
      assert.exists(
        result.contexts.find((c) => c.data.name === context.data.name),
        `${name} command was not loaded.`
      );
    }
  });
});
