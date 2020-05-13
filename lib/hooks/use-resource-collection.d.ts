import { ResourceCollection, ResourceCollectionConfig } from "../ResourceCollection";
import { ResourceID } from "../Resource";
export declare function useResourceCollection<T extends {
    id: ResourceID;
} = any>(config: ResourceCollectionConfig<T>): ResourceCollection<T>;
