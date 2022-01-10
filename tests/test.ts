import {
  fetch as fetchPolyfill,
  fetchS as fetchSPolyfill,
} from "../polyfill.ts";
import { assertEquals } from "https://deno.land/std@0.120.0/testing/asserts.ts";
import { toFileUrl } from "https://deno.land/std@0.120.0/path/mod.ts";

Deno.test("fetchPolyfill local file URL", async () => {
  const req = await fetchPolyfill(
    new URL("./fixtures/test.json", import.meta.url),
  );
  assertEquals(req.status, 200);
  assertEquals(req.headers.get("content-type"), "application/json");
  const json = await req.json();
  assertEquals(json, { hello: "world" });
});

Deno.test("fetchPolyfill local file URL (larger)", async () => {
  const lorem =
    (await Deno.readTextFile(new URL("./fixtures/lorem.txt", import.meta.url)))
      .repeat(32);
  const tmp = await Deno.makeTempFile();
  await Deno.writeTextFile(tmp, lorem);

  const response = await fetchPolyfill(toFileUrl(tmp));
  const text = await response.text();
  await Deno.remove(tmp);
  assertEquals(text, lorem);
});

Deno.test("fetchPolyfill 1MB file", async () => {
  const { size } = await Deno.stat(
    new URL("./fixtures/1MB.file", import.meta.url),
  );
  const response = await fetchPolyfill(
    new URL("./fixtures/1MB.file", import.meta.url),
  );
  const file = await response.blob();

  assertEquals(size, file.size);
});

Deno.test("fetchSPolyfill lorem", async function () {
  assertEquals(
    await fetchSPolyfill(new URL("./fixtures/lorem.txt", import.meta.url), {
      bodyMethod: "text",
    }),
    await Deno.readTextFile(new URL("./fixtures/lorem.txt", import.meta.url)),
  );
});

Deno.test("fetchSPolyfill no bodyMethod", async function () {
  assertEquals(
    await fetchSPolyfill(
      new URL("./fixtures/lorem.txt", import.meta.url),
    ) instanceof
      ReadableStream,
    true,
  );
});
