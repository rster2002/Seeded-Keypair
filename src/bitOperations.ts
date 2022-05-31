// export function decimalToBinary(decimal, minLength = 0) {
//     var result = [];
//     while (decimal !== 0n) {
//         var remainder = decimal % 2n;
//         result.push(BigInt(remainder));
//         decimal = decimal / 2n;
//     }
//
//     result = binaryToMinLength(result.reverse(), minLength);
//
//     return result;
// }
//
// export function decimalToBinaryUnsigned(decimal, minLength) {
//     var bits = decimalToBinary(decimal);
//     bits = binaryToMinLength(bits, minLength);
//
//     bits.unshift(0n);
//
//     return bits;
// }
//
// export function binaryToMinLength(bits, minLength) {
//     while (bits.length < minLength) {
//         bits.unshift(0n);
//     }
//
//     return bits;
// }
//
// export function binaryAdd(a, b) {
//     a = a.reverse();
//     b = b.reverse();
//     var borrowing = 0n;
//     var result = [];
//
//     var i = 0;
//     while (!(a[i] === undefined && b[i] === undefined && borrowing === 0n)) {
//         let valueA = a[i] !== undefined ? a[i] : 0n;
//         let valueB = b[i] !== undefined ? b[i] : 0n;
//
//         let total = valueA + valueB + borrowing;
//         let subResult = 0n;
//
//         if (total === 0n) {
//             subResult = 0n;
//             borrowing = 0n;
//         } else if (total === 1n) {
//             subResult = 1n;
//             borrowing = 0n;
//         } else if (total === 2n) {
//             subResult = 0n;
//             borrowing = 1n;
//         } else if (total === 3n) {
//             subResult = 1n;
//             borrowing = 1n;
//         }
//
//         result.push(subResult);
//
//         i++;
//     }
//
//     return result.reverse();
// }
//
// export function binaryToDecimal(bits) {
//     var result = 0n;
//     bits = [...bits];
//     bits = bits.reverse();
//
//     for (var i = 0; i < bits.length; i++) {
//         let bit = bits[i];
//         let power = 2n ** BigInt(i);
//         result += bit * power;
//     }
//
//     return result;
// }
//
// export function textToBinary(string) {
//     var result = [];
//
//     for (var character of string) {
//         result = [
//             ...result,
//             ...decimalToBinary(BigInt(character.charCodeAt(0)), 8),
//         ]
//     }
//
//     return result;
// }
//
// export function binaryToText(bits) {
//     bits = [...bits];
//     var result = "";
//     var minLength = Math.ceil(bits.length / 8);
//     bits = binaryToMinLength(bits, minLength * 8);
//
//     while (bits.length > 0) {
//         var byte = bits.splice(0, 8);
//         var charCode = binaryToDecimal(byte);
//         var character = String.fromCharCode(Number(charCode));
//
//         result += character;
//     }
//
//     return result;
// }
//
// export function baseStringToNumber(string, base) {
//     string = string.toLowerCase();
//     string = string.split("").reverse();
//
//     var valueMap = {};
//     var result = 0n;
//
//     for (var i = 0n; i < base; i++) {
//         valueMap[i.toString(base)] = i;
//     }
//
//     for (var i = 0n; i < string.length; i++) {
//         let character = string[i];
//         let value = valueMap[character];
//
//         result += value * (16n ** i);
//     }
//
//     return result;
// }
//
// export function binaryToHex(bits) {
//     var number = binaryToDecimal(bits);
//     var string = number.toString(16);
//
//     if (string.length % 2 !== 0) string = "0" + string;
//
//     return string;
// }
//
// export function hexToBinary(hex) {
//     var number = baseStringToNumber(hex, 16);
//     return decimalToBinary(number);
// }
//
// export function btoa(input) {
//     return Buffer.from(input, "binary").toString('base64')
// }
//
// export function atob(input) {
//     return Buffer.from(input, 'base64').toString()
// }