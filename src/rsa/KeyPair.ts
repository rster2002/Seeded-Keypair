import safePow from "./safePow";

export default class KeyPair {
    private readonly p: bigint;
    private readonly q: bigint;
    private readonly e: bigint;
    private readonly N: bigint;
    private readonly L: bigint;
    private readonly d: bigint;
    
    constructor(p: bigint, q: bigint, e: bigint) {
        this.p = p;
        this.q = q;
        this.e = e;
        
        this.N = p * q;
        this.L = (p - 1n) * (q - 1n);
        this.d = this.modInverse(e, this.L);
    }
    
    encrypt(message: string) {
        return safePow(this.stringToBigInt(message), this.e, this.N);
    }
    
    decrypt(message: bigint) {
        return this.bigIntToString(safePow(message, this.d, this.N));
    }
    
    private stringToBigInt(input: string): bigint {
        let chars = input.split("");
        let bigInt = 0n;
        
        for (let char of chars) {
            let charCode = char.charCodeAt(0);

            bigInt = bigInt << 8n;
            bigInt = bigInt | BigInt(charCode);
        }
        
        return bigInt;
    }
    
    private bigIntToString(input: bigint): string {
        let string = "";
        
        while (input !== 0n) {
            string = String.fromCharCode(Number(input & 255n)) + string;
            input = input >> 8n;
        }
        
        return string;
    }
    
    private modInverse(a: bigint, n: bigint): bigint {
        let n0 = n;
        let y = 0n;
        let x = 1n;

        if (n == 1n) return 0n;

        while (a > 1n) {
            let q = a / n;
            let t = n;

            n = a % n;
            a = t;
            t = y;

            y = x - q * t;
            x = t;
        }

        if (x < 0) {
            x = x + n0
        }

        return x;
    }
}