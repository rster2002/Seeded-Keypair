import CryptoRSA from "./CryptoRSA";
import SeededRSA from "./SeededRSA";

async function main() {
    let generator = new SeededRSA(2048, 65537);
    let keys = await generator.generateSeeded(657575);

    console.log(keys.getPublic());
    // console.log(keys.bigIntToBase64(0b01001101n));
    // console.log(keys.encrypt("Hello world").toString());
}

main();

// import Asn1Encoder from "./Asn1Encoder";
// import BinaryHelper from "./BinaryHelper";
//
// let encoder = new Asn1Encoder();
//
// let encodedValue = encoder.sequence(
//     encoder.integer(12n),
//     encoder.integer(12n),
// );
// console.log(encodedValue.toString(2));
// console.log(BinaryHelper.bigIntToBase64(encodedValue));
