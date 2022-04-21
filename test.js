import test from 'ava';
import {fnv1a32, mulberry32, hashFunc, hrwHash} from './src/main.js';

test('fnv1a32', t => {
	t.is(fnv1a32(''), 2_166_136_261n);
	t.is(fnv1a32('hello world'), 3_582_672_807n);
	// Verify Unicode handling against values from https://www.tools4noobs.com/online_tools/hash/
	t.is(fnv1a32('🦄🌈'), 0xAA_F5_FE_E7n);
	t.is(fnv1a32('\u{0000}\u{0080}\u{0100}\u{0180}\u{0250}\u{02B0}\u{0300}\u{0370}\u{0400}\u{0500}\u{0530}\u{0590}\u{0600}\u{0700}\u{0780}\u{0900}\u{0980}\u{0A00}\u{0A80}\u{0B00}\u{0B80}\u{0C00}\u{0C80}\u{0D00}\u{0D80}\u{0E00}\u{0E80}\u{0F00}\u{1000}\u{10A0}\u{1100}\u{1200}\u{13A0}\u{1400}\u{1680}\u{16A0}\u{1700}\u{1720}\u{1740}\u{1760}\u{1780}\u{1800}\u{1900}\u{1950}\u{19E0}\u{1D00}\u{1E00}\u{1F00}\u{2000}\u{2070}\u{20A0}\u{20D0}\u{2100}\u{2150}\u{2190}\u{2200}\u{2300}\u{2400}\u{2440}\u{2460}\u{2500}\u{2580}\u{25A0}\u{2600}\u{2700}\u{27C0}\u{27F0}\u{2800}\u{2900}\u{2980}\u{2A00}\u{2B00}\u{2E80}\u{2F00}\u{2FF0}\u{3000}\u{3040}\u{30A0}\u{3100}\u{3130}\u{3190}\u{31A0}\u{31F0}\u{3200}\u{3300}\u{3400}\u{4DC0}\u{4E00}\u{A000}\u{A490}\u{AC00}\u{D800}\u{DC00}\u{E000}\u{F900}\u{FB00}\u{FB50}\u{FE00}\u{FE20}\u{FE30}\u{FE50}\u{FE70}\u{FF00}\u{FFF0}\u{10000}\u{10080}\u{10100}\u{10300}\u{10330}\u{10380}\u{10400}\u{10450}\u{10480}\u{10800}\u{1D000}\u{1D100}\u{1D300}\u{1D400}\u{20000}\u{2F800}\u{E0000}\u{E0100}'), 0x98_3F_DF_05n);
});

test('mulberry32', t => {
	t.is(mulberry32(0), 1_144_304_738);
	t.is(mulberry32(1000), 3_415_336_119);
});

test('hashFunc', t => {
	t.is(hashFunc(''), 2_625_274_932);
	t.is(hashFunc('image-server-1.example.com'), 4_232_815_984);
	t.is(hashFunc('image-server-2.example.com'), 3_438_438_587);
});

test('hrwHash', t => {
	const servers = ['image-server-1.example.com', 'image-server-2.example.com'];
	const image = 'example.png';
	const expectedResult = servers[1];
	t.is(hrwHash(image, servers)[0], expectedResult);

	servers.reverse();
	t.is(hrwHash(image, servers)[0], expectedResult);
});
