import { Resource, ResourceConfig } from './Resource';

export interface DummyResourceConfig<T> extends ResourceConfig<T> {}

export class DummyResource<T> extends Resource<T, DummyResourceConfig<T>> {
  get = async () => {};

  create = async (values: T) => {
    if (this.onCreate && this.data) {
      this.onCreate('blah', this.data);
    }
  };

  put = async (values: T) => {
    if (this.onUpdate) {
      this.onUpdate(values);
    }
  };

  patch = async (
    values: Partial<T>,
    props?: {
      fields?: string[];
    }
  ) => {
    if (this.onUpdate) {
      this.onUpdate(values);
    }
  };

  delete = async () => {
    if (this.onDelete && this.data) {
      this.onDelete(this.data);
    }
  };
}
