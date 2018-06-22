export class ConnectorError extends Error {
  connectorError = true;
  errors: Error[];
  authorization: boolean;

  constructor(authorization: boolean, errors: Error[]) {
    super(errors.map(x => x.message).join(', '));
    this.authorization = authorization;
    this.errors = errors;
  }
}

export function isConnectorError(arg: any): arg is ConnectorError {
  return arg.connectorError === true;
}
