import { fetchS, fetchSPolyfill } from "../mod.ts";

const r1 = await fetchS("https://github.com", { bodyMethod: "text" });
console.log(r1);

const r2 = await fetchSPolyfill(import.meta.url, { bodyMethod: "blob" });
console.log(r2);

const r3 = await fetchS("https://github.com");
console.log(r3 instanceof ReadableStream);
