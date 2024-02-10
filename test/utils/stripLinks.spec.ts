import { assert } from "chai";

import { stripLinks } from "../../src/utils/stripLinks";

suite("stripLinks utility", () => {
  test("does not mutate message with no links", () => {
    const str = "Hi, I'm Naomi!";
    assert.equal(stripLinks(str), "Hi, I'm Naomi!");
  });
  test("removes link from message", () => {
    const str = "Hi, I'm Naomi! [Check out my profile!](https://naomi.lgbt)";
    assert.equal(stripLinks(str), "Hi, I'm Naomi! Check out my profile!");
  });
  test("removes multiple links from message", () => {
    const str =
      "Hi, I'm [Naomi](https://naomi.lgbt)! Join my [server?](https://chat.naomi.lgbt)";
    assert.equal(stripLinks(str), "Hi, I'm Naomi! Join my server?");
  });
  test("handles message with ONLY link", () => {
    const str = "[Check out my profile!](<https://naomi.lgbt>)";
    assert.equal(stripLinks(str), "Check out my profile!");
  });
  test("handles embed-suppressed links", () => {
    const str = "Hi, I'm Naomi! [Check out my profile!](<https://naomi.lgbt>)";
    assert.equal(stripLinks(str), "Hi, I'm Naomi! Check out my profile!");
  });
});
