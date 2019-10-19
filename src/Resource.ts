import { ResourceBase, ResourceBaseConfig } from './ResourceBase';

export type ResourceID = string | number;

export interface ResourceConfig<T> extends ResourceBaseConfig {
  id?: ResourceID;
  initialValues?: T;
  onCreate?: (id: ResourceID, values: T) => void;
  onUpdate?: (values: Partial<T>) => void;
  onDelete?: (values: T) => void;
}

export class Resource<
  T = { [key: string]: any },
  C extends ResourceConfig<T> = ResourceConfig<T>
> extends ResourceBase<T> {
  id?: ResourceID;
  onCreate?: (id: ResourceID, values: T) => void;
  onUpdate?: (values: Partial<T>) => void;
  onDelete?: (values: T) => void;

  // this hash is used to simulate "cancelling" behaviour of loading requests
  // it's compared with the latest generated requst hash to make sure that resource collection displays only latest loading request
  // this is required in case of multiple get calls with different params (eg. autocompletion)
  private updatingHash: string = '';
  private patchHash: string = '';

  constructor(config: C) {
    super(config);
    this.id = config.id || undefined;
    this.onCreate = config.onCreate;
    this.onUpdate = config.onUpdate;
    this.onDelete = config.onDelete;
    if (!this.id) {
      this.data = config.initialValues;
    }
  }

  async tryWithLoading(p: Promise<any>, saveError = true): Promise<any> {
    this.error = undefined;
    this.loading = true;
    try {
      return await p;
    } catch (err) {
      if (saveError) {
        this.error = err;
      }
      throw err;
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
    this.initialized = true;
    this.data = res;
    return res;
  };

  create = async (values: T) => {
    values = Object.assign({}, this.data, values);

    const fields = [...(this.fields || [])];
    if (fields.indexOf('id') === -1) {
      fields.push('id');
    }

    const res = await this.tryWithLoading(
      this.dataSource.create(this.name, values, fields, this.arguments),
      false
    );
    this.data = res;
    this.id = res.id;

    if (this.onCreate) {
      this.onCreate(res.id, res);
    }

    return res;
  };

  // deprecated, please use put
  update = async (values: T) => {
    return this.put(values);
  };
  put = async (values: T) => {
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
      ),
      false
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
  updateValues = async (props: { values: Partial<T>; fields?: string[] }) => {
    const { values, ...rest } = props;
    return this.patch(values, rest);
  };
  patch = async (
    values: Partial<T>,
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
    if (this.onDelete) {
      this.onDelete(res);
    }
    return res;
  };

  isPersisted = (): boolean => {
    return !!this.id;
  };

  save = async (values: T) => {
    values = Object.assign({}, this.data, values);
    if (!this.id) {
      return this.create(values);
    }
    return this.update(values);
  };
}
