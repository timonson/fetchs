import { handleResponse } from "./handler.ts";
import { FetchSError } from "./error.ts";

import type { BodyMethod, FetchS } from "./types.ts";

export const fetchS: FetchS = async (
  input: string | Request | URL,
  init?: RequestInit & { bodyMethod?: BodyMethod },
) => {
  const res = await fetch(input, init).catch((err) => {
    throw new FetchSError(err.message, 0, "Network Error");
  });
  return await handleResponse(res, init);
};
