import { hrwHash, hashFunc } from 'hrw-hash' // or use require()
const servers = ['image-server-1', 'image-server-2', 'image-server-3', 'image-server-4']

// hash space lookup table creation is O(N) - hey but it is cached
// hash space is in 32-bit space (2^32) internally
function computeLookupTable(servers, buckets) {
  const bucketRange = 2**32 / buckets;
  const lookupTable = {};
  for (let i = 0; i < maxServersEver; i++) {
    const rangeKey = `${(bucketRange * i) + (bucketRange / 2)}`; // not converting it into hex as
    // the hex contains too many zeros that seems to reduce distribution. using the decimal
    // representation instead
    lookupTable[bucketRange * i] = hrwHash(rangeKey, servers, true)[0];
  }

  // ---- debug logs - debug distribution ----
  const dist = Object.values(lookupTable).reduce((acc, val) => {
    acc[val] = (acc[val] || 0) +  1;
    return acc;
  }, []);
  const max = Object.values(dist).reduce((max, val) => Math.max(max, val), -Infinity);
  const min = Object.values(dist).reduce((min, val) => Math.min(min, val), Infinity);
  console.log('lookupTable distribution', dist);
  console.log('lookupTable distribution unbalance ratio', parseFloat((max / min).toFixed(3)));
  // ---- debug logs end ----

  return lookupTable;
}

// lookup is of O(1) - here's where you get the speed
function lookup(key, lookupTable, buckets) {
  const bucketRange = 2**32 / buckets;
  return lookupTable[bucketRange * Math.floor(hashFunc(key) / bucketRange)];
}

// let's say we would utmost have 1024 servers ever in the life time of a service
// dont go for a smaller number as the distribution of load across the servers may
// not be good enough. why? because the hash function distribution is such
// also, always pick a exponent of 2, so that 2^32 can be divided evenly
const maxServersEver = 1024;

console.log('buckets', maxServersEver);
let lookupTable = computeLookupTable(servers, maxServersEver);
// console.log('lookupTable', lookupTable);


// now, any future keys can be mapped easily in O(1)
// console.log(hashFunc('image.png'))
// console.log(hashFunc('image.png') / bucketRange)
// console.log(bucketRange * Math.floor(hashFunc('image.png') / bucketRange))
const testKey = 'image.png';
console.log('lookup', testKey, '=', lookup(testKey, lookupTable, maxServersEver));
// output: image-server-3


// now remove a server, recompute lookup table and try same image again
servers.splice(0, 1);
lookupTable = computeLookupTable(servers, maxServersEver)
console.log('lookup', testKey, 'after removing a server =', lookup(testKey, lookupTable, maxServersEver));
// output: image-server-3

// now remove a server, recompute lookup table and try same image again
servers.pop();
lookupTable = computeLookupTable(servers, maxServersEver)
console.log('lookup', testKey, 'after removing a server =', lookup(testKey, lookupTable, maxServersEver));
// output: image-server-3