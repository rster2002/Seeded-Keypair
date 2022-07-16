import KeyPair from "./KeyPair";
import safePow from "./safePow";

export default abstract class RSAGenerator {
    private readonly n: number;
    private readonly e: number;

    public k: number = 500;
    public ensureKey: boolean = true;

    protected abstract randomBit(): boolean;

    constructor(n: number, e: number = 65537) {
        this.n = n;
        this.e = e;
    }

    async generateKeypair() {
        let p = await this.generateComponent(this.n / 2);
        let q = await this.generateComponent(this.n - (this.n / 2));

        if (p < q) {
            let t = p;
            p = q;
            q = t;
        }

        return new KeyPair(p, q, BigInt(this.e));
    }

    private async generateComponent(length: number, e: bigint = 65537n): Promise<bigint> {
        let component = e + 1n;

        while (component % e === 1n) {
            component = await this.generatePrime(length);
        }

        return component;
    }

    private async generatePrime(length: number): Promise<bigint> {
        while (this.ensureKey) {
            let result = (() => {
                let randomBigint = this.randomBigintFromLength(length, 0b11n);
                randomBigint = randomBigint | 1n;

                let result = this.findPrime(length, randomBigint);

                if (result !== 0n) {
                    return result;
                }

                if (!this.ensureKey) {
                    throw new Error("No prime after K");
                }
            })();

            if (result !== undefined) {
                return result;
            }
        }
    }

    private randomBigintFromLength(n: number, component: bigint = 0n): bigint {
        let offset = component.toString(2).length;

        for (let i = 0; i < (n - offset); i++) {
            component = component << 1n;

            if (this.randomBit()) {
                component = component | 1n;
            }
        }

        return component;
    }

    private findPrime(n: number, startingNumber: bigint): bigint {
        let number = startingNumber;

        let maxK = (n * Math.log(2)) / 2;

        for (let i = 0; i < maxK; i++) {
            let result = (() => {
                if (this.checkPrime(number)) {
                    return number;
                }

                number += 2n;
            })();

            if (result !== undefined) {
                return result;
            }
        }

        return 0n;
    }

    private checkPrime(n: bigint): boolean {
        if (n === 2n || n === 3n) {
            return true;
        }

        if (n % 2n === 0n || n < 2n) {
            return false;
        }

        for (let i = 2n; i < 1000n; i++) {
            if (n % i === 0n) {
                return false;
            }
        }

        return this.millerRabin(n);
    }

    private millerRabin(n: bigint): boolean {
        let s = 0n;
        let d = n - 1n;

        while ((d & 1n) === 0n) {
            (() => {
                d >>= 1n;
                ++s;
            })();
        }

        let base = 2n;
        let x = safePow(base, d, n);

        if (x === 1n || x === n - 1n) {
            return true;
        }

        for (let i = 0n; i <= s; i++) {
            let result = (() => {
                x = safePow(x, x, n);

                if (x === n - 1n) {
                    return true;
                }
            })();

            if (result !== undefined) {
                return result;
            }
        }

        return false;
    }
}
