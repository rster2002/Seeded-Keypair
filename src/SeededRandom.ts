export default class SeededRandom {
    private currentValue: number;
    
    constructor(seed: number) {
        this.currentValue = seed;
    }
    
    next() {
        return this.currentValue = this.currentValue * 16807 % 2147483647;
    }
}