# fetchS

**fetch s**omething with types

### Simplified [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

```typescript
import { fetchS } from "https://deno.land/x/fetchs/mod.ts";

await fetchS("https://github.com", { bodyMethod: "text" });
```

### Polyfill to fetch files with [deno](https://github.com/denoland/deno)

```typescript
import { fetchSPolyfill } from "https://deno.land/x/fetchs/mod.ts";

await fetchSPolyfill(import.meta.url, { bodyMethod: "blob" });
```
