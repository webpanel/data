import {
  ResourceCollection,
  ResourceCollectionConfig
} from './ResourceCollection';

export interface DummyResourceCollectionConfig<T>
  extends ResourceCollectionConfig {
  initialData: T[];
}

export class DummyResourceCollection<T> extends ResourceCollection<
  T[],
  DummyResourceCollectionConfig<T>
> {
  public get = async (): Promise<void> => {
    this.data = this.initialConfig.initialData;
    this.count = this.initialConfig.initialData.length;
  };
}
