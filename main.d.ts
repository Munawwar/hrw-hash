/**
 * 32-bit FNV-1a hash algorithm taken from https://github.com/sindresorhus/fnv1a
 * @param {string} string
 * @returns {bigint} between 0 and 2^32
 */
export function fnv1a32(string: string): bigint;
/**
 * Mulberry32 seeded PRNG algorithm taken from https://github.com/sadeqush/Shuffle-Deshuffle-Array
 * @param {number|bigint} seed
 * @returns {number} between 0 and 2^32
 */
export function mulberry32(seed: number | bigint): number;
/**
 * Hash function algorithm: mulberry32(fnv1a(string))
 * 32-bit FNV-1a hash algorithm taken from https://github.com/sindresorhus/fnv1a
 * Mulberry32 seeded PRNG algorithm taken from https://github.com/sadeqush/Shuffle-Deshuffle-Array
 * @param {string} string
 * @returns {number} between 0 and 2^32
 */
export function hashFunc(string: string): number;
/**
 * @param {string|number} key
 * @param {string[]} destinations
 * @returns {string[]} destinations sorted in highest to lowest preference
 * @throws {Error} When key is invalid
 */
export function hrwHash(key: string | number, destinations: string[]): string[];
