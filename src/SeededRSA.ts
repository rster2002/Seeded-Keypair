import RSAGenerator from "./rsa/RSAGenerator";
import KeyPair from "./rsa/KeyPair";
import SeededRandom from "./SeededRandom";

export default class SeededRSA extends RSAGenerator {
    private randomGenerator: SeededRandom;
    
    protected randomBit(): boolean {
        return this.randomGenerator.next() % 2 === 0;
    }

    async generateSeeded(seed: number) {
        this.randomGenerator = new SeededRandom(seed);
        return super.generateKeys();
    }
}