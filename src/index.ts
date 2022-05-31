import CryptoRSA from "./CryptoRSA";

async function main() {
    let generator = new CryptoRSA(2048, 65537);
    let keys = await generator.generateKeys();
    
    console.log(keys);
    console.log(keys.encrypt("Hello world"));
}

main();
