
// npm install fast-sha256
import * as Hasher from 'fast-sha256';

// formats 
var hex2bin = (hex) => {
  return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}

// @see https://en.bitcoin.it/wiki/Genesis_block
const version = '01000000';
const previousBlock = '0000000000000000000000000000000000000000000000000000000000000000';
const merkleRoot = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b';
const timestamp = '29AB5F49';
const bits = 'FFFF001D'; 
const nonce = '1DAC2B7C';

// - Concatenate all header data
const header = version + previousBlock + merkleRoot + timestamp + bits + nonce;
const binary = hex2bin(header);

// - Use hasher then convert back to binary
const round1 = hex2bin( Hasher.sha256(binary) );

// - Second hasher pass
const round2 = Hasher.sha256(round1);

// - Now swap bits back to "big endianness"
const hashed = round2.split('').reverse().join('').replace(/(.)(.)/, '$2$1');
console.log(hashed);