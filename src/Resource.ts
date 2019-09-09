import { ResourceBase, ResourceBaseConfig } from './ResourceBase';

type ResourceID = string | number;

export interface ResourceConfig extends ResourceBaseConfig {
  id?: ResourceID;
  initialValues?: { [key: string]: any };
  onCreate?: (id: ResourceID, values: { [key: string]: any }) => void;
  onUpdate?: (values: { [key: string]: any }) => void;
}

export class Resource extends ResourceBase<any | null> {
  id?: ResourceID;
  onCreate?: (id: ResourceID, values: { [key: string]: any }) => void;
  onUpdate?: (values: { [key: string]: any }) => void;

  // this hash is used to simulate "cancelling" behaviour of loading requests
  // it's compared with the latest generated requst hash to make sure that resource collection displays only latest loading request
  // this is required in case of multiple get calls with different params (eg. autocompletion)
  private updatingHash: string = '';
  private patchHash: string = '';

  constructor(config: ResourceConfig) {
    super(config);
    this.id = config.id || undefined;
    this.onCreate = config.onCreate;
    this.onUpdate = config.onUpdate;
    if (!this.id) {
      this.data = config.initialValues;
    }
  }

  async tryWithLoading(p: Promise<any>): Promise<any> {
    this.error = undefined;
    this.loading = true;
    try {
      return await p;
    } catch (err) {
      this.error = err;
    } finally {
      this.loading = false;
    }
  }

  getIfHasID = async () => {
    if (this.id) {
      return this.get();
    }
  };

  get = async () => {
    if (!this.id) {
      throw new Error('resource id is missing');
    }
    let res = await this.tryWithLoading(
      this.dataSource.read(this.name, this.id, this.fields, this.arguments)
    );
    this.data = res;
    return res;
  };

  create = async (values: { [key: string]: any }) => {
    values = Object.assign({}, this.data, values);

    const fields = [...(this.fields || [])];
    if (fields.indexOf('id') === -1) {
      fields.push('id');
    }

    const res = await this.tryWithLoading(
      this.dataSource.create(this.name, values, fields, this.arguments)
    );
    this.data = res;
    this.id = res.id;

    if (this.onCreate) {
      this.onCreate(res.id, res);
    }

    return res;
  };

  // deprecated, please use put
  update = async (values: { [key: string]: any }) => {
    this.put(values);
  };
  put = async (values: { [key: string]: any }) => {
    if (!this.id) {
      throw new Error('resource id is missing');
    }

    values = Object.assign({}, this.data, values);
    const currentHash = Math.random()
      .toString(36)
      .substring(2);
    this.updatingHash = currentHash;

    let res = await this.tryWithLoading(
      this.dataSource.update(
        this.name,
        this.id,
        values,
        this.fields,
        this.arguments
      )
    );
    if (this.updatingHash == currentHash) {
      this.data = res;
    }
    if (this.onUpdate) {
      this.onUpdate(res);
    }
    return res;
  };

  // deprecated, use patch
  updateValues = async (props: {
    values: { [key: string]: any };
    fields?: string[];
  }) => {
    const { values, ...rest } = props;
    return this.patch(values, rest);
  };
  patch = async (
    values: { [key: string]: any },
    props?: {
      fields?: string[];
    }
  ) => {
    if (!this.id) {
      throw new Error('resource id is missing');
    }

    const currentHash = Math.random()
      .toString(36)
      .substring(2);
    this.patchHash = currentHash;

    let res = await this.tryWithLoading(
      this.dataSource.update(
        this.name,
        this.id,
        values,
        (props && props.fields) || this.fields,
        this.arguments
      )
    );

    if (this.patchHash == currentHash) {
      this.data = Object.assign({}, this.data, res);
    }
    if (this.onUpdate) {
      this.onUpdate(res);
    }
    return res;
  };

  delete = async () => {
    if (!this.id) {
      throw new Error('resource id is missing');
    }
    let res = await this.tryWithLoading(
      this.dataSource.delete(this.name, this.id, this.fields, this.arguments)
    );
    this.data = res;
    return res;
  };

  isPersisted = (): boolean => {
    return !!this.id;
  };

  save = async (values: { [key: string]: any }) => {
    values = Object.assign({}, this.data, values);
    if (!this.id) {
      return this.create(values);
    }
    return this.update(values);
  };
}
