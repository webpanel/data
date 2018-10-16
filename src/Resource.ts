import { ResourceBase, ResourceBaseConfig } from './ResourceBase';

type ResourceID = string | number;

export interface ResourceConfig extends ResourceBaseConfig {
  id?: ResourceID;
  initialValues?: { [key: string]: any };
  onCreate?: ((id: ResourceID, values: { [key: string]: any }) => void);
  onUpdate?: ((values: { [key: string]: any }) => void);
}

export class Resource extends ResourceBase<any | null> {
  id?: ResourceID;
  onCreate?: ((id: ResourceID, values: { [key: string]: any }) => void);
  onUpdate?: ((values: { [key: string]: any }) => void);

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

  update = async (values: { [key: string]: any }) => {
    values = Object.assign({}, this.data, values);
    if (!this.id) {
      throw new Error('resource id is missing');
    }
    let res = await this.tryWithLoading(
      this.dataSource.update(
        this.name,
        this.id,
        values,
        this.fields,
        this.arguments
      )
    );
    this.data = res;
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
