import { ResourceCollection, ResourceCollectionConfig } from './ResourceCollection';
export interface DummyResourceCollectionConfig<T> extends ResourceCollectionConfig {
    initialData: T[];
}
export declare class DummyResourceCollection<T> extends ResourceCollection<T[], DummyResourceCollectionConfig<T>> {
    get: () => Promise<void>;
}
