# HRW (Highest Random Weight) hashing / Rendezvous hashing

https://en.wikipedia.org/wiki/Rendezvous_hashing.

Advantage of this hashing over other sticky load balancing algorithms is that:
1. it does not use a shared lookup table / ring
2. it is independent of the order of destinations (hrwHash('john', ['a', 'b']) is same as hrwHash('john', ['b', 'a']))
3. it distributes keys evenly (probabilistically) when a destination is added or removed

Disadvantage of this hashing method:
1. Replacing a destination with another one will re-route keys unnecessarily as the algo is order insensitive

This implementation uses bigint (so needs node.js >= 12), unescape and encodeURIComponent (so it supports cloudflare workers).
It doesn't have any node.js specific dependencies and uses no 3rd party dependencies either.

It uses `mulberry32(fnv1a32('key'))` as hash function internally for the random hash.

```
npm install hrw-hash
```

```js
import { hrwHash } from 'hrw-hash'
// const { hrwHash } = require('hrw-hash')
console.log(hrwHash('key', ['a', 'b', 'c'])[0]); // c
```

```js
// a more real world example
const servers = ['image-server-1.example.com', 'image-server-2.example.com']
const domainToUse = hrwHash('example.png', servers)[0]
```


```js
// for advanced use cases you can import the hash function
import { hashFunc } from 'hrw-hash'
hashFunc('string') // returns positive integer < 2^32
```