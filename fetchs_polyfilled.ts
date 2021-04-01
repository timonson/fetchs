import { fetch as fetchPolyfilled } from "./fetch_polyfill.ts";
import { FetchSError } from "./error.ts";

import type { BodyMethod, FetchS } from "./types.ts";

export const fetchS: FetchS = async (
  url: string,
  init?: RequestInit & { bodyMethod?: BodyMethod },
): Promise<any> => {
  const res = await fetchPolyfilled(url, init).catch((err) => {
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
        break;
      case "blob":
        return await res.blob();
        break;
      case "formData":
        return await res.formData();
        break;
      case "json":
        return await res.json();
        break;
      case "text":
        return await res.text();
        break;
      case "uint8Array":
      default:
        return new Uint8Array(await res.arrayBuffer());
    }
  } catch (err) {
    throw new FetchSError(err.message, res.status, res.statusText);
  }
};
