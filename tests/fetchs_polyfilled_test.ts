import { assertEquals } from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { fetchS, fetchSPolyfill } from "../mod.ts";

Deno.test("fetchS", async function () {
  assertEquals(
    await fetchS("https://github.com") instanceof Uint8Array,
    new Uint8Array() instanceof Uint8Array,
  );
});

Deno.test("fetchSPolyfill", async function () {
  assertEquals(
    await fetchSPolyfill(import.meta.url, { bodyMethod: "text" }),
    await Deno.readTextFile(new URL(import.meta.url).pathname),
  );
});
