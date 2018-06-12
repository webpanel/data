import { Connector } from './Connector';
import { GraphQLQuery } from './GraphQLQuery';
import { GraphQLResponse } from './GraphQLResponse';
export declare class GraphQLConnector implements Connector {
    send(url: string, query: GraphQLQuery): Promise<GraphQLResponse>;
}
