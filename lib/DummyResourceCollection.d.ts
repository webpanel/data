import { ResourceCollection, ResourceCollectionConfig } from "./ResourceCollection";
import { ResourceID } from "./Resource";
export interface DummyResourceCollectionConfig<T> extends ResourceCollectionConfig<T> {
    initialData: T[];
}
export declare class DummyResourceCollection<T extends {
    id: ResourceID;
}> extends ResourceCollection<T, DummyResourceCollectionConfig<T>> {
    get: () => Promise<void>;
}
