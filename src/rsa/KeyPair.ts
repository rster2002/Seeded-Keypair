import safePow from "./safePow";
import BinaryHelper from "../BinaryHelper";
import PublicComponent from "./PublicComponent";

export default class KeyPair extends PublicComponent {
    private readonly p: bigint;
    private readonly q: bigint;
    private readonly L: bigint;
    private readonly d: bigint;

    constructor(p: bigint, q: bigint, e: bigint) {
        super(p * q, e)

        this.p = p;
        this.q = q;

        this.L = (p - 1n) * (q - 1n);
        this.d = this.modInverse(e, this.L);
    }

    extractPublicComponent(): PublicComponent {
        return new PublicComponent(this.N, this.e);
    }

    decrypt(message: string) {
        let chunks = message.split("$");
        return chunks.map(chunk => {
            let bigInt = BinaryHelper.base64toBigInt(chunk);
            return BinaryHelper.bigIntToString(safePow(bigInt, this.d, this.N));
        })
            .join("")
    }

    sign(message: string): string {
        let chunks = this.toChunks(message);

        return chunks.map(chunk => {
            let bitInt = BinaryHelper.stringToBigInt(chunk);
            let signature = safePow(bitInt, this.d, this.N);

            return BinaryHelper.bigIntToBase64(signature);
        })
            .join("$");
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

    toString() {
        return BinaryHelper.bigIntToBase64(this.p)
            + "$" + BinaryHelper.bigIntToBase64(this.q)
            + "$" + BinaryHelper.bigIntToBase64(this.e);
    }

    static fromString(string: string) {
        let [p, q, e] = string.split("$");

        return new KeyPair(
            BinaryHelper.base64toBigInt(p),
            BinaryHelper.base64toBigInt(q),
            BinaryHelper.base64toBigInt(e)
        );
    }
}
