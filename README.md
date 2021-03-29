# fetchS

**fetch s**omething with types

#### Normal [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

```typescript
import { fetchS } from "https://deno.land/x/fetchs/mod.ts"

await fetchS("https://github.com", { bodyMethod: "text" })
```

#### _Fetch polyfill_ for [deno](https://github.com/denoland/deno) to fetch files, as well

```typescript
import { fetchSPolyfill } from "https://deno.land/x/fetchs/mod.ts"

await fetchSPolyfill(import.meta.url, { bodyMethod: "blob" })
```
