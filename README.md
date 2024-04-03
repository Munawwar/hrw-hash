# HRW (Highest Random Weight) hashing / Rendezvous hashing

https://en.wikipedia.org/wiki/Rendezvous_hashing.

```
npm install hrw-hash
```

```js
import { hrwHash } from 'hrw-hash'
// or const { hrwHash } = require('hrw-hash')
const servers = ['image-server-1.example.com', 'image-server-2.example.com']
const domainToUse = hrwHash('example.png', servers)[0] // always 'image-server-2.example.com'
```

Advantage of this hashing over other sticky load balancing algorithms is that:
1. it does not use a shared lookup table / ring
2. it is independent of the order of destinations (hrwHash('john', ['a', 'b']) is same as hrwHash('john', ['b', 'a']))
3. it distributes keys evenly (probabilistically) when a destination is added or removed

Disadvantage of this hashing method:
1. Replacing a destination with another one will re-route keys unnecessarily as the algo is order insensitive

The implementation is small (0.5 kb minified) and with no 3rd party dependencies. It uses bigint, unescape and encodeURIComponent, so it supports modern browsers, node.js >= 12.5.0 and cloudflare workers.

It uses `mulberry32(fnv1a32('key'))` as hash function internally for the random hash. In my tests, this gives better distribution than fnv1a-32 alone and still keeps the implementation fast and small.


```js
// for advanced use cases you can import the hash function
import { hashFunc } from 'hrw-hash'
hashFunc('string') // returns positive integer < 2^32
```

# Breaking Change V2

- Removed minified dist files (dist/*.min.js). If you want minified build for browser, then use `import { hrwHash } from 'https://esm.sh/hrw-hash'`
- Removed UMD build
- Changed minimum node.js version requirement from >= v12.0.0 to >= 12.5.0