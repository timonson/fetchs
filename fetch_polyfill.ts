import { lookup } from "https://deno.land/x/media_types@v2.7.1/mod.ts";

export async function fetch(
  input: string | Request,
  init?: RequestInit,
): Promise<Response> {
  try {
    const url = typeof input === "string" ? new URL(input) : new URL(input.url);
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
          for await (const chunk of Deno.iter(file)) {
            controller.enqueue(chunk);
          }
          file.close();
          controller.close();
        },
        cancel() {
          file.close();
        },
      });
      return new Response(body, { status: 200, headers });
    }
    return window.fetch(input, init);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return new Response(null, { status: 404 });
    } else {
      return new Response(null, { status: 500 });
    }
  }
}
