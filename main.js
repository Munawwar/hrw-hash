/* eslint-disable no-mixed-operators,unicorn/prevent-abbreviations */
/**
 * 32-bit FNV-1a hash algorithm taken from https://github.com/sindresorhus/fnv1a
 * @param {string} string
 * @returns {bigint} between 0 and 2^32
 */
export function fnv1a32(string) {
	// FNV-1a hashing
	let hash = 2_166_136_261n;
	const fnvPrime = 16_777_619n;

	// Handle Unicode code points > 0x7f
	let isUnicoded = false;

	for (let index = 0; index < string.length; index++) {
		let characterCode = string.charCodeAt(index);

		// Non-ASCII characters trigger the Unicode escape logic
		if (characterCode > 0x7F && !isUnicoded) {
			string = unescape(encodeURIComponent(string));
			characterCode = string.charCodeAt(index);
			isUnicoded = true;
		}

		hash ^= BigInt(characterCode);
		hash = BigInt.asUintN(32, hash * fnvPrime);
	}

	return hash;
}

/**
 * Mulberry32 seeded PRNG algorithm taken from https://github.com/sadeqush/Shuffle-Deshuffle-Array
 * @param {number|bigint} seed
 * @returns {number} between 0 and 2^32
 */
export function mulberry32(seed) {
	// Mulberry32 PRNG
	let t = Number(seed) + 0x6D_2B_79_F5;
	t = Math.imul(t ^ t >>> 15, t | 1);
	t ^= t + Math.imul(t ^ t >>> 7, t | 61);
	// Unlike original Mulberry32 function, we dont need to divide by 2^32
	return (t ^ t >>> 14) >>> 0;
}

/**
 * Hash function algorithm: mulberry32(fnv1a(string))
 * 32-bit FNV-1a hash algorithm taken from https://github.com/sindresorhus/fnv1a
 * Mulberry32 seeded PRNG algorithm taken from https://github.com/sadeqush/Shuffle-Deshuffle-Array
 * @param {string} string
 * @returns {number} between 0 and 2^32
 */
export function hashFunc(string) {
	const hash = fnv1a32(string);

	// A seeded pseudorandom number generator gives more uniform distribution
	// on consecutive serial strings (e.g. 'img-1', 'img-2', 'img-3'...) than
	// using fnv1a hash alone.

	// Mulberry32 PRNG
	return mulberry32(hash);
}

/**
 * @param {string|number} key
 * @param {string[]} destinations
 * @returns {string[]} destinations sorted in highest to lowest preference
 * @throws {Error} When key is invalid
 */
export function hrwHash(key, destinations) {
	return destinations
		.map(destination => ({
			d: destination,
			w: hashFunc(String(key) + destination), // Weight
		}))
		.sort((a, b) => b.w - a.w)
		.map(item => item.d);
}
