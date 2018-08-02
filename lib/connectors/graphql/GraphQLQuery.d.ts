export declare type GraphQLArgumentType = GraphQLArgumentMap | string | number | null;
export interface GraphQLArgumentMap {
    [key: string]: GraphQLArgumentType | GraphQLArgumentType[];
}
export declare class GraphQLField {
    private name?;
    private _fields;
    private _args;
    constructor(name: string);
    field(field: GraphQLField | string): GraphQLField;
    fields(fields: GraphQLField[] | string[]): GraphQLField;
    arg(key: string, value: GraphQLArgumentType): GraphQLField;
    args(value: GraphQLArgumentMap): GraphQLField;
    toString(): string;
    private serializeArgs;
    private serializeArg;
}
export declare type GraphQLQueryType = 'query' | 'mutation';
export declare class GraphQLQuery extends GraphQLField {
    type: GraphQLQueryType;
    constructor(type: GraphQLQueryType, name: string);
    toString(): string;
}
