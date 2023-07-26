import { assert } from "chai";

import { parseQuestionContent } from "../../src/modules/parseQuestionContent";

suite("parseQuestionContent module", () => {
  test("should strip the header from a question", () => {
    assert.equal(
      parseQuestionContent(
        "Hey <@!465650873650118659>, your question has been moved here!\nmeep"
      ),
      "meep"
    );
  });

  test("should trim the final string", () => {
    assert.equal(
      parseQuestionContent(
        "Hey <@!465650873650118659>, your question has been moved here!\n\n\n\n\n\nmeep\n\n\n\n"
      ),
      "meep"
    );
  });

  test("should handle undefined content", () => {
    assert.equal(parseQuestionContent(undefined), "");
  });
});
