export enum Tag {
    Int = 0,
    String = 1,
    Sequence = 2,
    Prim0 = 3,
    Prim0Annot = 4,
    Prim1 = 5,
    Prim1Annot = 6,
    Prim2 = 7,
    Prim2Annot = 8,
    Prim = 9,
    Bytes = 10,
}

export const primitives = [
    "parameter", "storage", "code", "False", "Elt", "Left", "None", "Pair",
    "Right", "Some", "True", "Unit", "PACK", "UNPACK", "BLAKE2B", "SHA256", "SHA512", "ABS", "ADD",
    "AMOUNT", "AND", "BALANCE", "CAR", "CDR", "CHECK_SIGNATURE", "COMPARE", "CONCAT", "CONS",
    "CREATE_ACCOUNT", "CREATE_CONTRACT", "IMPLICIT_ACCOUNT", "DIP", "DROP", "DUP", "EDIV", "EMPTY_MAP",
    "EMPTY_SET", "EQ", "EXEC", "FAILWITH", "GE", "GET", "GT", "HASH_KEY", "IF", "IF_CONS", "IF_LEFT",
    "IF_NONE", "INT", "LAMBDA", "LE", "LEFT", "LOOP", "LSL", "LSR", "LT", "MAP", "MEM", "MUL", "NEG",
    "NEQ", "NIL", "NONE", "NOT", "NOW", "OR", "PAIR", "PUSH", "RIGHT", "SIZE", "SOME", "SOURCE",
    "SENDER", "SELF", "STEPS_TO_QUOTA", "SUB", "SWAP", "TRANSFER_TOKENS", "SET_DELEGATE", "UNIT",
    "UPDATE", "XOR", "ITER", "LOOP_LEFT", "ADDRESS", "CONTRACT", "ISNAT", "CAST", "RENAME", "bool",
    "contract", "int", "key", "key_hash", "lambda", "list", "map", "big_map", "nat", "option", "or",
    "pair", "set", "signature", "string", "bytes", "mutez", "timestamp", "unit", "operation",
    "address", "SLICE", "DIG", "DUG", "EMPTY_BIG_MAP", "APPLY", "chain_id", "CHAIN_ID", "LEVEL",
    "SELF_ADDRESS", "never", "NEVER", "UNPAIR", "VOTING_POWER", "TOTAL_VOTING_POWER", "KECCAK",
    "SHA3", "PAIRING_CHECK", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr", "sapling_state",
    "sapling_transaction", "SAPLING_EMPTY_STATE", "SAPLING_VERIFY_UPDATE", "ticket", "TICKET",
    "READ_TICKET", "SPLIT_TICKET", "JOIN_TICKETS", "GET_AND_UPDATE"
] as const;

// { parameter: 0, storage: 1, code: 2, ..., elementN: N }
export const primTags = primitives.reduce(
    (result, primitive, index) => {
        result[primitive] = index;
        return result;
    },
    {} as { [key: string]: number; }
);