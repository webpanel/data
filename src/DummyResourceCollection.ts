import {
  ResourceCollection,
  ResourceCollectionConfig
} from "./ResourceCollection";
import { ResourceID } from "./Resource";

export interface DummyResourceCollectionConfig<T>
  extends ResourceCollectionConfig<T> {
  initialData: T[];
}

export class DummyResourceCollection<
  T extends { id: ResourceID }
> extends ResourceCollection<T, DummyResourceCollectionConfig<T>> {
  public get = async (): Promise<void> => {
    this.data = this.initialConfig.initialData;
    this.count = this.initialConfig.initialData.length;
  };
}
