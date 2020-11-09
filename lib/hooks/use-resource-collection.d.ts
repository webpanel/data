import { ResourceCollection, ResourceCollectionConfig } from "../ResourceCollection";
import { ResourceID } from "../Resource";
interface ResourceCollectionHookConfig<T> extends ResourceCollectionConfig<T> {
    disabled?: boolean;
}
export declare function useResourceCollection<T extends {
    id: ResourceID;
} = any>(config: ResourceCollectionHookConfig<T>): ResourceCollection<T>;
export {};
