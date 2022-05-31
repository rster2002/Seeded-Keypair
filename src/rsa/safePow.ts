export default function safePow(a, b, n) {
    a = BigInt(a);
    b = BigInt(b);
    n = BigInt(n);

    a = a % n;
    let result = 1n;
    let x = a;


    while (b > 0) {
        let leastSignificantBit = b % 2n;
        b = b / 2n;

        if (leastSignificantBit === 1n) {
            result = result * x;
            result = result % n;
        }

        x = x * x;
        x = x % n;
    }

    return result;
}