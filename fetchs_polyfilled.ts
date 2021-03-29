import { fetch as fetchPolyfilled } from "./fetch_polyfill.ts";
import { FetchSError } from "./fetchs.ts";

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
  const contentType = res.headers.get("content-type");
  const contentLength = res.headers.get("content-length");
  if (res.status === 204 || contentLength === "0") return undefined;
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
};
