import RSAGenerator from "./rsa/RSAGenerator";
import SeededRandom from "./SeededRandom";

export default class SeededRSA extends RSAGenerator {
    private randomGenerator: SeededRandom;

    protected randomBit(): boolean {
        return this.randomGenerator.next() % 2n === 0n;
    }

    async generateSeeded(seed: bigint) {
        this.randomGenerator = new SeededRandom(seed);
        return super.generateKeypair();
    }
}
