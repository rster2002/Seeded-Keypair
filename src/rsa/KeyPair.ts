import safePow from "./safePow";
import BinaryHelper from "../BinaryHelper";
import Asn1Encoder from "../Asn1Encoder";

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
        return safePow(BinaryHelper.stringToBigInt(message), this.e, this.N);
    }
    
    decrypt(message: bigint) {
        return BinaryHelper.bigIntToString(safePow(message, this.d, this.N));
    }
    
    getPublic() {
        let encoder = new Asn1Encoder();
        
        return BinaryHelper.bigIntToBase64(
            encoder.sequence(
                encoder.unsignedInteger(this.N),
                encoder.unsignedInteger(this.e)
            )
        );
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