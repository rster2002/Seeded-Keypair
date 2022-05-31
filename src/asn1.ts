// import { binaryToHex, binaryToMinLength, hexToBinary, binaryToText, decimalToBinaryUnsigned, decimalToBinary, textToBinary, binaryToDecimal } from "./bitOperations";
//
// export const bes = {
//     createByte(hex) {
//         return binaryToMinLength(hexToBinary(hex), 8)
//     },
//     encodeLength(lengthOfValue) {
//         var numberOfBytesOfValue = BigInt(Math.ceil(lengthOfValue / 8));
//
//         if (numberOfBytesOfValue <= 127) {
//             return decimalToBinary(numberOfBytesOfValue, 8);
//         } else {
//             var bits = decimalToBinary(numberOfBytesOfValue);
//             var numberOfLengthBytes = Math.ceil(bits.length / 8);
//
//             if (numberOfLengthBytes <= 127) {
//                 var numberOfBytesLength = binaryToMinLength(decimalToBinary(BigInt(numberOfLengthBytes)), 8);
//                 numberOfBytesLength[0] = 1n;
//
//                 var bits = decimalToBinary(numberOfBytesOfValue);
//                 bits = binaryToMinLength(bits, numberOfLengthBytes * 8);
//
//                 return [
//                     ...numberOfBytesLength,
//                     ...bits,
//                 ]
//             } else {
//                 return hexToBinary("00");
//             }
//         }
//     },
//     encodeLengthEnd(lengthOfValue) {
//         var numberOfBytesOfValue = BigInt(Math.ceil(lengthOfValue / 8));
//         var bits = decimalToBinary(numberOfBytesOfValue);
//         var numberOfLengthBytes = Math.ceil(bits.length / 8);
//
//         if (numberOfLengthBytes > 127) {
//             return [
//                 ...hexToBinary("00"),
//                 ...hexToBinary("00"),
//             ]
//         } else {
//             return [];
//         }
//     },
//     encodeIntUnsigned(intValue) {
//         var typeByte = this.createByte("02");
//
//         var bits = decimalToBinaryUnsigned(intValue);
//         var minLength = Math.ceil(bits.length / 8) * 8;
//         bits = binaryToMinLength(bits, minLength);
//
//         var lengthByte = this.encodeLength(bits.length)
//         var lengthEndByte = this.encodeLengthEnd(bits.length);
//
//         return [
//             ...typeByte,
//             ...lengthByte,
//             ...bits,
//             ...lengthEndByte,
//         ]
//     },
//     encodeVisibleString(string) {
//         var typeByte = this.createByte("1a");
//
//         var bits = textToBinary(string);
//         var minLength = Math.ceil(bits.length / 8) * 8;
//         bits = binaryToMinLength(bits, minLength);
//
//         var lengthByte = this.encodeLength(bits.length)
//         var lengthEndByte = this.encodeLengthEnd(bits.length);
//
//         return [
//             ...typeByte,
//             ...lengthByte,
//             ...bits,
//             ...lengthEndByte,
//         ]
//     },
//     encodeBoolean(boolean) {
//         var typeByte = this.createByte("01");
//         var lengthByte = this.createByte("01");
//         var bits = binaryToMinLength(hexToBinary(boolean ? "01" : "00"), 8);
//
//         return [
//             ...typeByte,
//             ...lengthByte,
//             ...bits,
//         ]
//     },
//     encodeNull() {
//         var typeByte = this.createByte("05");
//         var lengthByte = this.createByte("00");
//
//         return [
//             ...typeByte,
//             ...lengthByte,
//         ]
//     },
//     encodeSequence(bits) {
//         var typeByte = this.createByte("30");
//
//         var lengthByte = this.encodeLength(bits.length)
//         var lengthEndByte = this.encodeLengthEnd(bits.length);
//
//         return [
//             ...typeByte,
//             ...lengthByte,
//             ...bits,
//             ...lengthEndByte,
//         ]
//     },
//     encodeSet(bits) {
//         var typeByte = this.createByte("31");
//
//         var lengthByte = this.encodeLength(bits.length)
//         var lengthEndByte = this.encodeLengthEnd(bits.length);
//
//         return [
//             ...typeByte,
//             ...lengthByte,
//             ...bits,
//             ...lengthEndByte,
//         ]
//     },
// }
//
// export function CreateDecoder(constructed = false) {
//     var hexString;
//
//     const toFullByte = bits => {
//         var minLength = Math.ceil(bits.length / 8) * 8;
//         return binaryToMinLength(bits, minLength);
//     }
//
//     const getByte = (length = 1n) => {
//         var byte = hexString.substring(0, Number(length * 2n));
//         hexString = hexString.replace(byte, "");
//
//         return byte;
//     }
//
//     const getLength = () => {
//         var byte = getByte();
//         var bits = toFullByte(hexToBinary(byte));
//
//         if (bits[0] === 0n) {
//             return binaryToDecimal(bits);
//         } else if (bits[0] === 1n) {
//             bits.shift();
//             var lengthOfLength = binaryToDecimal(bits);
//             var bytes = getByte(lengthOfLength);
//
//             return binaryToDecimal(hexToBinary(bytes));
//         }
//     }
//
//     const typeDecodeFunctions = {
//         "30": function decodeSequence(hexString) {
//             var decoder = CreateDecoder(1);
//             return decoder.decode(hexString);
//         },
//         "31": function decodeSet(hexString) {
//             var decoder = CreateDecoder(1);
//             return decoder.decode(hexString);
//         },
//         "02": function decodeIntUnsigned(hexString) {
//             var bits = hexToBinary(hexString);
//             return binaryToDecimal(bits);
//         },
//         "1a": function decodeVisibleString(hexString) {
//             var bits = hexToBinary(hexString);
//             return binaryToText(bits);
//         },
//         "01": function decodeBoolean(hexString) {
//             return hexString !== "00";
//         },
//         "05": function decodeNull(blockString) {
//             // Correction is needed because 0 is falsy causing getByte to incorrectly take an extra byte
//             hexString = blockString + hexString;
//             return null;
//         },
//     }
//
//     const decodeTLV = () => {
//         var result = [];
//
//         while (hexString.length > 0) {
//             var typeByte = getByte();
//             var length = getLength();
//
//             var blockString = getByte(length);
//             var blockFunction = typeDecodeFunctions[typeByte];
//
//             if (blockFunction !== undefined) {
//                 result.push(blockFunction(blockString));
//             }
//         }
//
//         return result;
//     }
//
//     return {
//         decode(hex) {
//             hexString = hex;
//
//             var result = decodeTLV();
//             return constructed ? result : result[0];
//         },
//     }
// }
//
// /* RSAPrivateKey ::= SEQUENCE {
// *   version           Version,
// *   modulus           INTEGER,  -- n
// *   publicExponent    INTEGER,  -- e
// *   privateExponent   INTEGER,  -- d
// *   prime1            INTEGER,  -- p
// *   prime2            INTEGER,  -- q
// *   exponent1         INTEGER,  -- d mod (p1)
// *   exponent2         INTEGER,  -- d mod (q-1)
// *   coefficient       INTEGER,  -- (inverse of q) mod p
// * }
// */
//
// // Person ::= SEQUENCE {
// //     Name VisibleString,
// //     Surname VisibleString,
// //     Age INTEGER
// //     IsOld BOOLEAN
// // }
//
// // const hex = binaryToHex(bes.encodeSequence([
// //     ...bes.encodeIntUnsigned(10n),
// //     ...bes.encodeIntUnsigned(20n),
// //     ...bes.encodeVisibleString("Hello world"),
// //     ...bes.encodeSequence([
// //         ...bes.encodeIntUnsigned(10n),
// //         ...bes.encodeIntUnsigned(20n),
// //         ...bes.encodeBoolean(true),
// //         ...bes.encodeNull(),
// //         ...bes.encodeSet([
// //             ...bes.encodeNull(),
// //         ]),
// //     ]),
// // ]));
//
// // const decoder = CreateDecoder();
// // console.log(
// //     hex,
// //     decoder.decode(hex)
// // );
//
// // module.exports = {
// //     bes,
// //     CreateDecoder,
// // };