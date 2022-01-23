(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.hrwHash = {}));
})(this, (function (exports) { 'use strict';

	/**
	 * 32-bit FNV-1a hash taken from https://github.com/sindresorhus/fnv1a/blob/main/index.js
	 * @param {string} string
	 * @returns {number}
	 */
	function fnv1a(string) {
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

		return Number(hash);
	}

	/**
	 * @param {string|number} key
	 * @param {string[]} destinations
	 * @return {string[]} destinations sorted in highest to lowest preference
	 * @throws {Error} When key is invalid
	 */
	function hrwHash(key, destinations) {
		return destinations
			.map(destination => ({
				d: destination,
				w: fnv1a(String(key) + destination), // Weight
			}))
			.sort((a, b) => b.w - a.w)
			.map(item => item.d);
	}

	exports.hrwHash = hrwHash;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
