import CryptoRSA from "./CryptoRSA";
import SeededRSA from "./SeededRSA";

async function main() {
    let generator = new SeededRSA(2048, 65537);
    let keys = await generator.generateSeeded(657575);
    
    console.log(keys.getN());
    // console.log(keys.encrypt("Hello world").toString());
}

main();
