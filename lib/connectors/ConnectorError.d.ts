export declare class ConnectorError extends Error {
    connectorError: boolean;
    errors: Error[];
    authorization: boolean;
    constructor(authorization: boolean, errors: Error[]);
}
export declare function isConnectorError(arg: any): arg is ConnectorError;
