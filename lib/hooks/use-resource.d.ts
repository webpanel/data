import { Resource, ResourceConfig } from "../Resource";
export interface ResourceHookConfig<T> extends ResourceConfig<T> {
    disabled?: boolean;
}
export declare function useResource<T = any>(config: ResourceHookConfig<T>): Resource<T>;
