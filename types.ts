type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [member: string]: JsonValue };
type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type BodyMethod =
  | "arrayBuffer"
  | "blob"
  | "formData"
  | "json"
  | "text"
  | "uint8Array";

export type FetchS<R = void> = {
  <R extends Promise<unknown> = Promise<ArrayBuffer | undefined>>(
    url: string,
    init: RequestInit & { bodyMethod: "arrayBuffer" },
  ): R;
  <R extends Promise<unknown> = Promise<Blob | undefined>>(
    url: string,
    init: RequestInit & { bodyMethod: "blob" },
  ): R;
  <R extends Promise<unknown> = Promise<FormData | undefined>>(
    url: string,
    init: RequestInit & { bodyMethod: "formData" },
  ): R;
  <R extends Promise<unknown> = Promise<string | undefined>>(
    url: string,
    init: RequestInit & { bodyMethod: "json" },
  ): R;
  <R extends Promise<unknown> = Promise<string | undefined>>(
    url: string,
    init: RequestInit & { bodyMethod: "text" },
  ): R;
  <R extends Promise<unknown> = Promise<Uint8Array | undefined>>(
    url: string,
    init?: RequestInit & { bodyMethod?: "uint8Array" },
  ): R;
};
