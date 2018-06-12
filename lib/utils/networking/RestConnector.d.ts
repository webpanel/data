import { Connector, Request, Response } from './Connector';
export declare class RestConnectorError extends Error {
    status: number;
    response: Response;
    constructor(status: number, response: Response, message?: string | undefined);
}
export declare class RestConnector implements Connector {
    send(req: Request, method: string): Promise<Response>;
}
