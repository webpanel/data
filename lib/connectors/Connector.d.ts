export { ConnectorError, isConnectorError } from './ConnectorError';
export { DataSourceRequest, DataSourceOperation } from '../DataSourceRequest';
export { HTTPResponse } from '../utils/HTTPResponse';
export { HTTPRequest } from '../utils/HTTPRequest';
export { ResourceResponse, ResourceCollectionResponse } from './ResponseDataTransformer';
import { DataSourceRequest } from '../DataSourceRequest';
import { ResourceCollectionResponse, ResourceResponse } from './ResponseDataTransformer';
export interface Connector {
    send(request: DataSourceRequest): Promise<ResourceResponse | ResourceCollectionResponse | null>;
}
