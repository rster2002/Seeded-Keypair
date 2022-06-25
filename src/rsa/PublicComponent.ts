import safePow from "./safePow";
import BinaryHelper from "../BinaryHelper";

export default class PublicComponent {
    protected readonly N: bigint;
    protected readonly e: bigint;

    constructor(N: bigint, e: bigint) {
        this.N = N;
        this.e = e;
    }

    encrypt(message: string) {
        let chunks = this.toChunks(message);

        return chunks.map(chunk => {
            let binary = safePow(BinaryHelper.stringToBigInt(chunk), this.e, this.N);
            return BinaryHelper.bigIntToBase64(binary);
        })
            .join("$");
    }

    checkSignature(message: string, signature: string): boolean {
        let messageChunks = this.toChunks(message);
        let signatureChunks = signature.split("$");

        if (messageChunks.length !== signatureChunks.length) {
            return false;
        }

        for (let i = 0; i < messageChunks.length; i++) {
            let messagePart = messageChunks[i];
            let signaturePart = signatureChunks[i];

            let signatureBigInt = BinaryHelper.base64toBigInt(signaturePart);
            let verifier = safePow(signatureBigInt, this.e, this.N);

            if (messagePart !== BinaryHelper.bigIntToString(verifier)) {
                return false;
            }
        }

        return true;
    }

    protected toChunks(string: string): string[] {
        let chunkLength = this.N.toString(2).length / 8;
        let chunks = [];

        while (string.length > chunkLength) {
            let chunk = string.slice(0, chunkLength);

            chunks.push(chunk);
            string = string.slice(chunkLength);
        }

        if (string !== "") {
            chunks.push(string);
        }

        return chunks;
    }

    toString() {
        return BinaryHelper.bigIntToBase64(this.N)
            + "$" + BinaryHelper.bigIntToBase64(this.e)
    }

    static fromString(string: string) {
        let [N, e] = string.split("$");

        return new PublicComponent(
            BinaryHelper.base64toBigInt(N),
            BinaryHelper.base64toBigInt(e)
        );
    }
}
