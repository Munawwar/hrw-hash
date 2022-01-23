/**
 * @param {string|number} key
 * @param {string[]} destinations
 * @return {string[]} destinations sorted in highest to lowest preference
 * @throws {Error} When key is invalid
 */
export function hrwHash(key: string | number, destinations: string[]): string[];
