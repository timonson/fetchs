import { fetchS, fetchSPolyfill } from "../mod.ts";

await fetchS("https://github.com", { bodyMethod: "text" });

await fetchSPolyfill(import.meta.url, { bodyMethod: "blob" });
