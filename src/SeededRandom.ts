export default class SeededRandom {
    private currentValue: bigint;

    constructor(seed: bigint) {
        this.currentValue = seed;
    }

    next() {
        return this.currentValue = this.currentValue * 16807n % 2147483647n;
    }
}
