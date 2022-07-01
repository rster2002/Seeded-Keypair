import RSAGenerator from "./rsa/RSAGenerator";

export default class CryptoRSA extends RSAGenerator {
    protected randomBit(): boolean {
        let i = new Uint8Array(1);
        //@ts-ignore
        crypto.getRandomValues(i);

        return i[0] % 2 === 0;
    }
}
