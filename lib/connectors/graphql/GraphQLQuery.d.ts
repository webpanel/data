import { SortInfo } from '../../DataSourceRequest';
export declare type GraphQLArgumentType = GraphQLArgumentMap | SortInfo | string | number | null | undefined;
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
    formatSortInfo(sorting: object): any;
    private serializeArgs;
    private serializeArg;
    readonly arguments: object;
}
export declare type GraphQLQueryType = 'query' | 'mutation';
export declare class GraphQLQuery extends GraphQLField {
    type: GraphQLQueryType;
    constructor(type: GraphQLQueryType, name: string);
    toString(): string;
    readonly variables: {};
}
