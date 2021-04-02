import { assertEquals } from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { fetchSPolyfill } from "../mod.ts";

Deno.test("fetchSPolyfill", async function () {
  assertEquals(
    await fetchSPolyfill(import.meta.url, { bodyMethod: "text" }),
    await Deno.readTextFile(new URL(import.meta.url).pathname),
  );
});
