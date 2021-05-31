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
  <R extends Promise<unknown> = Promise<ArrayBuffer>>(
    input: string | Request | URL,
    init: RequestInit & { bodyMethod: "arrayBuffer" },
  ): R;
  <R extends Promise<unknown> = Promise<Blob>>(
    input: string | Request | URL,
    init: RequestInit & { bodyMethod: "blob" },
  ): R;
  <R extends Promise<unknown> = Promise<FormData>>(
    input: string | Request | URL,
    init: RequestInit & { bodyMethod: "formData" },
  ): R;
  <R extends Promise<unknown> = Promise<string>>(
    input: string | Request | URL,
    init: RequestInit & { bodyMethod: "json" },
  ): R;
  <R extends Promise<unknown> = Promise<string>>(
    input: string | Request | URL,
    init: RequestInit & { bodyMethod: "text" },
  ): R;
  <R extends Promise<unknown> = Promise<Uint8Array>>(
    input: string | Request | URL,
    init?: RequestInit & { bodyMethod?: "uint8Array" },
  ): R;
};
