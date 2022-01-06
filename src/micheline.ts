// Michelson abstract syntax tree types https://tezos.gitlab.io/whitedoc/michelson.html#concrete-syntax

export interface Node {
}

/**
 * An AST node representing Michelson string literal.
 */
export interface StringLiteral extends Node {
    string: string;
}

/**
 * An AST node representing Michelson int literal.
 */
export interface IntLiteral<T extends string = string> extends Node {
    int: T;
}

/**
 * An AST node representing Michelson bytes literal.
 */
export interface BytesLiteral extends Node {
    bytes: string;
}

/**
 * An AST node representing Michelson primitive.
 */
export interface Prim<PT extends string = string, AT extends Expr[] = Expr[]> extends Node {
    prim: PT;
    args?: AT;
    annots?: string[];
}

export type List<T extends Expr> = T[] & Node;

interface ExprList extends List<Expr> { }

/**
 * An AST node representing valid Michelson expression. Directly corresponds to JSON-encoded Michelson node
 */

export type Expr = Prim | StringLiteral | IntLiteral | BytesLiteral | ExprList;