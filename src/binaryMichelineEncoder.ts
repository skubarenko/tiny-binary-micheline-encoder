import { TextEncoder } from 'util';

import { Expr } from "./micheline.js";
import { primTags, Tag } from "./tags.js";
import { checkDecodeTezosID, parseHex } from './utils.js';
import { Writer } from "./writer.js";

type AddressType = "ED25519PublicKeyHash" | "SECP256K1PublicKeyHash" | "P256PublicKeyHash" | "ContractHash";

enum ContractID {
    Implicit = 0,
    Originated = 1,
}

enum PublicKeyHashID {
    ED25519 = 0,
    SECP256K1 = 1,
    P256 = 2,
}

export class BinaryMichelineEncoder {
    public encodeMichelsonData(data: Expr): number[] {
        const writer = new Writer();
        writer.writeUint8(5);

        this.writeExpr(data, writer);

        return writer.buffer;
    }

    public encodeAddress(rawAddress: string): number[] {
        const writer = new Writer();
        const [address, entryPoint] = rawAddress.split("%");
        const addressInfo = checkDecodeTezosID(address, "ED25519PublicKeyHash", "SECP256K1PublicKeyHash", "P256PublicKeyHash", "ContractHash");
        if (!addressInfo) {
            throw new Error(`Invalid address: ${rawAddress}`);
        }
        const [addressType, addressHash] = addressInfo;

        if (addressType === "ContractHash") {
            writer.writeUint8(ContractID.Originated);
            writer.writeBytes(Array.from(addressHash));
            writer.writeUint8(0);
        } else {
            writer.writeUint8(ContractID.Implicit);
            this.writePublicKeyHash(addressType, addressHash, writer);
        }

        if (entryPoint !== undefined && entryPoint !== "" && entryPoint !== "default") {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(entryPoint);
            writer.writeBytes(Array.from(bytes));
        }

        return writer.buffer;
    }

    protected writeExpr(expr: Expr, writer: Writer): void {
        if (Array.isArray(expr)) {
            const nestedWriter = new Writer();
            for (const v of expr) {
                this.writeExpr(v, nestedWriter);
            }
            writer.writeUint8(Tag.Sequence);
            writer.writeUint32(nestedWriter.length);
            writer.writeBytes(nestedWriter.buffer);
            return;
        }

        if ("string" in expr) {
            const enc = new TextEncoder();
            const bytes = enc.encode(expr.string);
            writer.writeUint8(Tag.String);
            writer.writeUint32(bytes.length);
            writer.writeBytes(Array.from(bytes));
            return;
        }

        if ("int" in expr) {
            writer.writeUint8(Tag.Int);
            let val = BigInt(expr.int);
            const sign = val < 0;
            if (sign) {
                val = -val;
            }

            let i = 0;
            do {
                const bits = (i === 0) ? BigInt(6) : BigInt(7);
                let byte = val & ((BigInt(1) << bits) - BigInt(1));
                val >>= bits;
                if (val) {
                    byte |= BigInt(0x80);
                }
                if (i === 0 && sign) {
                    byte |= BigInt(0x40);
                }
                writer.writeUint8(Number(byte));
                i++;
            } while (val);
            return;
        }

        if ("bytes" in expr) {
            const bytes = parseHex(expr.bytes);
            writer.writeUint8(Tag.Bytes);
            writer.writeUint32(bytes.length);
            writer.writeBytes(bytes);
            return;
        }

        const prim = primTags[expr.prim];
        if (prim === undefined) {
            throw new TypeError(`Can't encode primary: ${expr.prim}`);
        }

        const tag = (expr.args?.length || 0) < 3 ?
            Tag.Prim0 + (expr.args?.length || 0) * 2 + (expr.annots === undefined || expr.annots.length === 0 ? 0 : 1) :
            Tag.Prim;

        writer.writeUint8(tag);
        writer.writeUint8(prim);

        if (expr.args !== undefined) {
            if (expr.args.length < 3) {
                for (const v of expr.args) {
                    this.writeExpr(v, writer);
                }
            } else {
                const nestedWriter = new Writer();
                for (const v of expr.args) {
                    this.writeExpr(v, nestedWriter);
                }
                writer.writeUint32(nestedWriter.length);
                writer.writeBytes(nestedWriter.buffer);
            }
        }

        if (expr.annots !== undefined && expr.annots.length !== 0) {
            const enc = new TextEncoder();
            const bytes = enc.encode(expr.annots.join(" "));
            writer.writeUint32(bytes.length);
            writer.writeBytes(Array.from(bytes));
        } else if (expr.args !== undefined && expr.args.length >= 3) {
            writer.writeUint32(0);
        }
    }

    protected writePublicKeyHash(addressType: AddressType, addressHash: number[], writer: Writer): void {
        let tag: PublicKeyHashID;

        switch (addressType) {
            case "ED25519PublicKeyHash":
                tag = PublicKeyHashID.ED25519;
                break;
            case "SECP256K1PublicKeyHash":
                tag = PublicKeyHashID.SECP256K1;
                break;
            case "P256PublicKeyHash":
                tag = PublicKeyHashID.P256;
                break;
            default:
                throw new Error(`unexpected address type: ${addressType}`);
        }

        writer.writeUint8(tag);
        writer.writeBytes(addressHash);
    }
}