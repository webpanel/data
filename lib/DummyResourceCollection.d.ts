import { ResourceCollection, ResourceCollectionConfig } from './ResourceCollection';
export interface DummyResourceCollectionConfig<T> extends ResourceCollectionConfig<T> {
    initialData: T[];
}
export declare class DummyResourceCollection<T> extends ResourceCollection<T, DummyResourceCollectionConfig<T>> {
    get: () => Promise<void>;
}
