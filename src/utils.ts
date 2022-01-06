import { decodeBase58Check } from "./base58.js";

export type TezosIDType = "BlockHash" | "OperationHash" | "OperationListHash" | "OperationListListHash" |
"ProtocolHash" | "ContextHash" | "ED25519PublicKeyHash" | "SECP256K1PublicKeyHash" |
"P256PublicKeyHash" | "ContractHash" | "CryptoboxPublicKeyHash" | "ED25519Seed" |
"ED25519PublicKey" | "SECP256K1SecretKey" | "P256SecretKey" | "ED25519EncryptedSeed" |
"SECP256K1EncryptedSecretKey" | "P256EncryptedSecretKey" | "SECP256K1PublicKey" |
"P256PublicKey" | "SECP256K1Scalar" | "SECP256K1Element" | "ED25519SecretKey" |
"ED25519Signature" | "SECP256K1Signature" | "P256Signature" | "GenericSignature" | "ChainID";

export type TezosIDPrefix = [number, number[]]; // payload length, prefix

export const tezosPrefix: Record<TezosIDType, TezosIDPrefix> = {
    BlockHash: [32, [1, 52]], // B(51)
    OperationHash: [32, [5, 116]], // o(51)
    OperationListHash: [32, [133, 233]], // Lo(52)
    OperationListListHash: [32, [29, 159, 109]], // LLo(53)
    ProtocolHash: [32, [2, 170]], // P(51)
    ContextHash: [32, [79, 199]], // Co(52)
    ED25519PublicKeyHash: [20, [6, 161, 159]], // tz1(36)
    SECP256K1PublicKeyHash: [20, [6, 161, 161]], // tz2(36)
    P256PublicKeyHash: [20, [6, 161, 164]], // tz3(36)
    ContractHash: [20, [2, 90, 121]], // KT1(36)
    CryptoboxPublicKeyHash: [16, [153, 103]], // id(30)
    ED25519Seed: [32, [13, 15, 58, 7]], // edsk(54)
    ED25519PublicKey: [32, [13, 15, 37, 217]], // edpk(54)
    SECP256K1SecretKey: [32, [17, 162, 224, 201]], // spsk(54)
    P256SecretKey: [32, [16, 81, 238, 189]], // p2sk(54)
    ED25519EncryptedSeed: [56, [7, 90, 60, 179, 41]], // edesk(88)
    SECP256K1EncryptedSecretKey: [56, [9, 237, 241, 174, 150]], // spesk(88)
    P256EncryptedSecretKey: [56, [9, 48, 57, 115, 171]], // p2esk(88)
    SECP256K1PublicKey: [33, [3, 254, 226, 86]], // sppk(55)
    P256PublicKey: [33, [3, 178, 139, 127]], // p2pk(55)
    SECP256K1Scalar: [33, [38, 248, 136]], // SSp(53)
    SECP256K1Element: [33, [5, 92, 0]], // GSp(54)
    ED25519SecretKey: [64, [43, 246, 78, 7]], // edsk(98)
    ED25519Signature: [64, [9, 245, 205, 134, 18]], // edsig(99)
    SECP256K1Signature: [64, [13, 115, 101, 19, 63]], // spsig1(99)
    P256Signature: [64, [54, 240, 44, 52]], // p2sig(98)
    GenericSignature: [64, [4, 130, 43]], // sig(96)
    ChainID: [4, [87, 82, 0]],
};

export function checkDecodeTezosID<T extends TezosIDType[]>(id: string, ...types: T): [T[number], number[]] | null {
    const buf = decodeBase58Check(id);
    for (const t of types) {
        const [plen, p] = tezosPrefix[t];
        if (buf.length === plen + p.length) {
            let i = 0;
            while (i < p.length && buf[i] === p[i]) {
                i++;
            }
            if (i === p.length) {
                return [t, buf.slice(p.length)];
            }
        }
    }
    return null;
}

export function parseHex(s: string): number[] {
    const res: number[] = [];
    for (let i = 0; i < s.length; i += 2) {
        const ss = s.slice(i, i + 2);
        const x = parseInt(ss, 16);
        if (Number.isNaN(x)) {
            throw new Error(`can't parse hex byte: ${ss}`);
        }
        res.push(x);
    }
    return res;
}

export function hexBytes(bytes: number[]): string {
    return bytes.map(x => ((x >> 4) & 0xf).toString(16) + (x & 0xf).toString(16)).join("");
}
