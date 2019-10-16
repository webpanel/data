import { SortInfo } from '../../DataSourceRequest';
export declare type GraphQLArgumentType = GraphQLArgumentMap | SortInfo | string | number | null | undefined;
export declare type SortInfoValue = string | {
    [key: string]: any;
};
export interface GraphQLArgumentMap {
    [key: string]: GraphQLArgumentType | GraphQLArgumentType[];
}
export interface GraphQLFieldOptions {
    sortingFormatter: (sorting: SortInfo[]) => SortInfoValue[];
}
export declare class GraphQLField {
    private name?;
    protected options: GraphQLFieldOptions;
    private _fields;
    private _args;
    constructor(name: string, options?: GraphQLFieldOptions);
    field(field: GraphQLField | string): GraphQLField;
    fields(fields: GraphQLField[] | string[]): GraphQLField;
    arg(key: string, value: GraphQLArgumentType): GraphQLField;
    args(value: GraphQLArgumentMap): GraphQLField;
    toString(): string;
    formatSortInfo(sorting: SortInfo[]): SortInfoValue[];
    private serializeArgs;
    private serializeArg;
    readonly arguments: object;
}
export declare type GraphQLQueryType = 'query' | 'mutation';
export declare class GraphQLQuery extends GraphQLField {
    type: GraphQLQueryType;
    constructor(type: GraphQLQueryType, name: string, options?: GraphQLFieldOptions);
    toString(): string;
    readonly variables: {};
}
