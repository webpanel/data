import fetch from 'node-fetch';
import { AuthSession } from 'webpanel-auth';

import { Connector, ConnectorError } from './Connector';
import { GraphQLQuery } from './GraphQLQuery';
import { GraphQLResponse } from './GraphQLResponse';

export class GraphQLConnector implements Connector {
  async send(url: string, query: GraphQLQuery): Promise<GraphQLResponse> {
    // console.log(query, query.toString());

    const body = { query: query.toString() };

    const accessToken = AuthSession.current().accessToken;

    let res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });

    let json = await res.json();
    if (json.errors) {
      let authorization = false;
      const errors = json.errors.map((e: Error) => {
        if (
          e.message === 'jwt must be provided' ||
          e.message === 'jwt malformed'
        ) {
          authorization = true;
        }
        return new Error(e.message);
      });
      throw new ConnectorError(authorization, errors);
      // throw { graphql: true, authorization, errors };
    }

    return new GraphQLResponse(json.data);
  }
}
