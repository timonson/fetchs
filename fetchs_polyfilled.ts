import { fetch as fetchPolyfilled } from "./fetch_polyfill.ts";
import { FetchSError } from "./error.ts";

import type { BodyMethod, FetchS } from "./types.ts";

export const fetchS: FetchS = async (
  input: string | Request | URL,
  init?: RequestInit & { bodyMethod?: BodyMethod },
) => {
  const res = await fetchPolyfilled(input, init).catch((err) => {
    throw new FetchSError(err.message, 0, "Network Error");
  });
  if (!res.ok) {
    throw new FetchSError(
      `Received status code ${res.status} instead of 200-299 range`,
      res.status,
      res.statusText,
    );
  }
  try {
    switch (init?.bodyMethod) {
      case "arrayBuffer":
        return await res.arrayBuffer();
      case "blob":
        return await res.blob();
      case "formData":
        return await res.formData();
      case "json":
        return await res.json();
      case "text":
        return await res.text();
      case "uint8Array":
        return new Uint8Array(await res.arrayBuffer());
      default:
        return res.body;
    }
  } catch (err) {
    throw new FetchSError(err.message, res.status, res.statusText);
  }
};
