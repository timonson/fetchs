import { iter, lookup } from "./deps.ts";
import { handleResponse } from "./handler.ts";
import { FetchSError } from "./error.ts";

import type { BodyMethod, FetchS } from "./types.ts";

/**
 * Adapted from https://github.com/lucacasonato/deno_local_file_fetch
 */

export async function fetch(
  input: string | Request | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    const url = typeof input === "string"
      ? new URL(input)
      : input instanceof Request
      ? new URL(input.url)
      : input;
    if (url.protocol === "file:") {
      // Only allow GET requests
      if (init && init.method && init.method !== "GET") {
        return new Response(null, {
          status: 405,
          headers: new Headers({ "Allow": "GET" }),
        });
      }
      const info = await Deno.stat(url);
      const contentType = lookup(url.pathname);
      const ifModifiedSince = new Headers(init?.headers).get(
        "if-modified-since",
      );
      const headers = new Headers();
      if (contentType) {
        headers.set("content-type", contentType);
      }
      if (info.mtime) {
        headers.set("last-modified", info.mtime.toUTCString());
        if (
          ifModifiedSince &&
          info.mtime.getTime() < (new Date(ifModifiedSince).getTime() + 1000)
        ) {
          return new Response(null, { status: 304, headers });
        }
      }
      // Open the file, and convert to ReadableStream
      const file = await Deno.open(url, { read: true });
      const body = new ReadableStream<Uint8Array>({
        start: async (controller) => {
          for await (const chunk of iter(file)) {
            controller.enqueue(chunk.slice(0));
          }
          file.close();
          controller.close();
        },
        cancel() {
          file.close();
        },
      });
      const response = new Response(body, { status: 200, headers });
      Object.defineProperty(response, "url", {
        get() {
          return url;
        },
        configurable: true,
        enumerable: true,
      });
      return response;
    }
    return globalThis.fetch(input, init);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return new Response(null, { status: 404 });
    } else {
      return new Response(null, { status: 500 });
    }
  }
}

export const fetchS: FetchS = async (
  input: string | Request | URL,
  init?: RequestInit & { bodyMethod?: BodyMethod },
) => {
  const res = await fetch(input, init).catch((err) => {
    throw new FetchSError(err.message, 0, "Network Error");
  });
  return await handleResponse(res, init);
};
