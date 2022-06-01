export default class Asn1Encoder {
    sequence(...rest: bigint[]) {
        let value = 0n;
        for (let bigint of rest) {
            value = this.pushBytes(value, bigint);
        }
        
        return this.createComponent(0x30n, value);
    }
    
    integer(input: bigint) {
        return this.createComponent(0x02n, input);
    }
    
    unsignedInteger(input: bigint) {
        let value = 0n;
        value = this.pushBits(value, input);
        
        return this.integer(value);
    }
    
    private getByteLength(input: bigint): bigint {
        let bytes = Math.ceil(input.toString(2).length / 8) * 8;
        return BigInt(bytes);
    }
    
    private pushBits(input: bigint, bits: bigint): bigint {
        input = input << BigInt(bits.toString(2).length);
        return input | bits;
    }
    
    private pushBytes(input: bigint, bits: bigint): bigint {
        input = input << this.getByteLength(bits);
        return input | bits;
    }
    
    private createComponent(header: bigint, value: bigint, unsigned: boolean = false): bigint {
        let out = 0n;
        out = this.pushBytes(out, header);
        
        let valueBytes = this.getByteLength(value) / 8n;
        let undefinedLength = false;
        
        if (valueBytes < 127) {
            out = this.pushBytes(out, valueBytes);
        } else {
            let lengthBytes = this.getByteLength(valueBytes) / 8n;
            
            if (lengthBytes < 127) {
                let lengthHeader = 1n << 7n;
                lengthHeader = lengthHeader | lengthBytes;
                lengthHeader = this.pushBytes(lengthHeader, valueBytes);
                
                out = this.pushBytes(out, lengthHeader);
            } else {
                out = out << 8n; // 0x00
                undefinedLength = true;
            }
        }
        
        if (unsigned) {
            
        }
        
        out = this.pushBytes(out, value);
        
        if (undefinedLength) {
            out = out << 8n; // 0x00
            out = out << 8n; // 0x00
        }
        
        return out;
    }
}