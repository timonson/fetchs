import { fetch as fetchPolyfilled } from "./fetch_polyfill.ts";
import { FetchSError } from "./error.ts";

import type { BodyMethod, FetchS } from "./types.ts";

export const fetchS: FetchS = async (
  url: string,
  init?: RequestInit & { bodyMethod?: BodyMethod },
): Promise<any> => {
  const res = await fetchPolyfilled(url, init);
  if (!res.ok) {
    throw new FetchSError(
      `${res.status} '${res.statusText}' received instead of 200-299 range.`,
      res.status,
      res.statusText,
    );
  }
  switch (init?.bodyMethod) {
    case "arrayBuffer":
      return await res.arrayBuffer();
      break;
    case "blob":
      return await res.blob();
      break;
    case "formData":
      return await res.formData().catch((err) => {
        throw new FetchSError(err.message, res.status, res.statusText);
      });
      break;
    case "json":
      return await res.json().catch((err) => {
        throw new FetchSError(err.message, res.status, res.statusText);
      });
      break;
    case "text":
      return await res.text();
      break;
    case "uint8Array":
    default:
      return new Uint8Array(await res.arrayBuffer());
  }
};
