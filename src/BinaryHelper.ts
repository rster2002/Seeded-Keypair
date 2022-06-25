export default abstract class BinaryHelper {
    static bigIntToString(input: bigint): string {
        let string = "";

        while (input !== 0n) {
            string = String.fromCharCode(Number(input & 255n)) + string;
            input = input >> 8n;
        }

        return string;
    }

    static stringToBigInt(input: string): bigint {
        let chars = input.split("");
        let bigInt = 0n;

        for (let char of chars) {
            let charCode = char.charCodeAt(0);

            bigInt = bigInt << 8n;
            bigInt = bigInt | BigInt(charCode);
        }

        return bigInt;
    }

    static bigIntToBase64(input: bigint): string {
        return btoa(BinaryHelper.bigIntToString(input));
    }

    static base64toBigInt(input: string) {
        return BinaryHelper.stringToBigInt(atob(input));
    }
}
