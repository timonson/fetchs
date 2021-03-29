import { lookup } from "https://deno.land/x/media_types@v2.7.1/mod.ts";

export async function fetch(
  input: string | Request,
  init?: RequestInit,
): Promise<Response> {
  const url = typeof input === "string" ? new URL(input) : new URL(input.url);
  if (url.protocol === "file:") {
    // Only allow GET requests
    if (init && init.method && init.method !== "GET") {
      throw new TypeError(
        `${init.method} is not a supported method for file:// URLs.`,
      );
    }

    // Open the file, and convert to ReadableStream
    const file = await Deno.open(url, { read: true }).catch((err) => {
      if (err instanceof Deno.errors.NotFound) {
        return new Response("Not found", { status: 404 });
      } else {
        return new Response("Internal server error", { status: 500 });
      }
    });
    if (file instanceof Response) {
      return file;
    }
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

    const headers = new Headers();
    const contentType = lookup(url.pathname);
    if (contentType) {
      headers.set("content-type", contentType);
    }
    const info = await Deno.stat(url);
    if (info.mtime) {
      headers.set("last-modified", info.mtime.toUTCString());
    }
    // Create 200 streaming response
    return new Response(body, { status: 200, headers });
  }

  return window.fetch(input, init);
}
