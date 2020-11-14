import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { isEmpty, convertBearerToToken, displayDinosaur, formatDate, formatClock, timestampToMillis, millisToMinutes, paddingLeft } from "./index.ts";

Deno.test("isEmpty", () => {
  assertEquals(isEmpty({}), true);
  assertEquals(isEmpty({ hello: "World" }), false);
});

Deno.test("convertBearerToToken", () => {
  const [token, header, payload, signature] = convertBearerToToken("Bearer XXX.YYY.ZZZ");

  assertEquals(token, "XXX.YYY.ZZZ");
  assertEquals(header, "XXX");
  assertEquals(payload, "YYY");
  assertEquals(signature, "ZZZ");
});

Deno.test("displayDinosaur", () => {
  const INLINE_PROD = " __(_ \\  \\ \\_.----._   \\         \\    |  ) |  ) \\__    |_|--|_|'-.__\\";
  const INLINE_DEV = " __(_ \\  \\ \\_/\\/\\/\\_   \\         |_    |  ) |  )  |_    |_|--|_|'-.__\\";

  assertEquals(displayDinosaur(true).replace(/\n/g, ""), INLINE_PROD);
  assertEquals(displayDinosaur().replace(/\n/g, ""), INLINE_DEV);
});

Deno.test("formatDate", () => {
  const now = new Date();

  assertEquals(formatDate(now), `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`);
});

Deno.test("formatClock", () => {
  const now = new Date();

  assertEquals(formatClock(now), `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
});

Deno.test("timestampToMillis", () => {
  assertEquals(timestampToMillis(1_000), 1_000_000);
});

Deno.test("millisToMinutes", () => {
  assertEquals(millisToMinutes(90_000), 2);
  assertEquals(millisToMinutes(90_000, false), 1.5);
});

Deno.test("paddingLeft", () => {
  const params = {
    text: "World",
    char: "*"
  };

  assertEquals(paddingLeft(params), "*****World");
  assertEquals(paddingLeft(params, "Hello"), "HelloWorld");
});
